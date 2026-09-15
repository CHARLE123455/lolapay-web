import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { ENDPOINTS } from './endpoints';
import { ApiError, type ApiEnvelope, type AuthResult, messageOf } from './types';

const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined;
if (!baseURL) throw new Error('VITE_API_BASE_URL is not set.');

const LOGIN_PATH = (import.meta.env.VITE_LOGIN_PATH as string) || '/login';

const ACCESS_KEY = 'lolapay.access';
const REFRESH_KEY = 'lolapay.refresh';
const USER_KEY = 'lolapay.user';

export const tokenStore = {
    getAccess: (): string | null => sessionStorage.getItem(ACCESS_KEY),
    getRefresh: (): string | null => localStorage.getItem(REFRESH_KEY),
    set: (access: string, refresh: string) => {
        sessionStorage.setItem(ACCESS_KEY, access);
        localStorage.setItem(REFRESH_KEY, refresh);
    },
    clear: () => {
        sessionStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
    },
    getUser: (): string | null => localStorage.getItem(USER_KEY),
    setUser: (json: string) => localStorage.setItem(USER_KEY, json),
};

export const AUTH_EXPIRED_EVENT = 'lolapay:auth-expired';

const api: AxiosInstance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    timeout: 30_000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = tokenStore.getAccess();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let refreshing: Promise<string | null> | null = null;
let loggingOut = false;

async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) return null;
    try {
        const { data } = await axios.post<ApiEnvelope<AuthResult>>(`${baseURL}${ENDPOINTS.auth.refresh}`, { refreshToken });
        if (!data.data) return null;
        tokenStore.set(data.data.accessToken, data.data.refreshToken);
        tokenStore.setUser(JSON.stringify(data.data.user));
        return data.data.accessToken;
    } catch {
        return null;
    }
}

function forceLogout() {
    if (loggingOut) return;
    loggingOut = true;
    tokenStore.clear();
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith(LOGIN_PATH)) {
        window.location.href = LOGIN_PATH;
    }
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(new ApiError('Unexpected error', 0));
        }

        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new ApiError('Request timed out. Please try again.', 0, 'TIMEOUT'));
        }

        const status = error.response?.status ?? 0;
        const body = error.response?.data as ApiEnvelope | undefined;
        const original = error.config as RetriableConfig | undefined;
        const isAuthRoute = original?.url?.includes('/auth/') ?? false;

        if (status === 401 && original && !original._retried && !isAuthRoute) {
            original._retried = true;
            refreshing ??= refreshAccessToken().finally(() => (refreshing = null));
            const token = await refreshing;
            if (token) {
                original.headers.Authorization = `Bearer ${token}`;
                return api(original);
            }
            forceLogout();
            return Promise.reject(new ApiError(messageOf(body, 'Your session has expired.'), 401, body?.code));
        }

        if (status === 0) {
            return Promise.reject(new ApiError('Network error. Check your connection and try again.', 0, 'NETWORK'));
        }

        return Promise.reject(new ApiError(messageOf(body), status, body?.code, body?.details));
    },
);

export const unwrap = <T>(res: AxiosResponse<ApiEnvelope<T>>): T => res.data.data as T;

export default api;