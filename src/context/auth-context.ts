import { createContext } from 'react';
import type { LoginInput, RegisterInput, User } from '../lib/types';

export interface AuthState {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    loginWithGoogle: (idToken: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthState | null>(null);