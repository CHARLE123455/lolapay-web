import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AUTH_EXPIRED_EVENT } from "../lib/api";
import type { LoginInput, RegisterInput, User } from "../lib/types";
import { authService, usersService } from "../services";
import { AuthContext, type AuthState } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(() => authService.cachedUser());
  const [loading, setLoading] = useState(() => authService.hasSession());

  useEffect(() => {
    if (!authService.hasSession()) return;
    usersService
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      queryClient.clear();
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, [queryClient]);

  const login = useCallback(async (input: LoginInput) => {
    const { user } = await authService.login(input);
    setUser(user);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const { user } = await authService.register(input);
    setUser(user);
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const { user } = await authService.loginWithGoogle(idToken);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    setUser(await usersService.me());
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      loginWithGoogle,
      logout,
      refreshUser,
      setUser,
    }),
    [user, loading, login, register, loginWithGoogle, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
