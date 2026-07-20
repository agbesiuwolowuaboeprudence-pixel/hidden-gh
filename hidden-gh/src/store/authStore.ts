/**
 * Global auth state — powered by Zustand.
 * Persists the JWT token in SecureStore and exposes it app-wide.
 */

import { create } from 'zustand';
import * as authService from '../services/authService';
import type { AuthUser, LoginPayload, RegisterPayload } from '../services/authService';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isHydrated: boolean;

  // Actions
  hydrate: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser) => void;
  setAuth: (user: AuthUser) => void;
  continueAsGuest: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isHydrated: false,

  /** Called once on app start to restore token from SecureStore */
  hydrate: async () => {
    const token = await authService.getStoredToken();
    set({ token, isHydrated: true });
  },

  login: async (payload) => {
    set({ isLoading: true });
    try {
      const user = await authService.login(payload);
      set({ user, token: user.token, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const user = await authService.register(payload);
      set({ user, token: user.token, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, token: null });
  },

  setUser: (user) => set({ user }),
  setAuth: (user) => set({ user, token: user.token }),
  continueAsGuest: () => {
    const guest: AuthUser = {
      token: '',
      email: 'guest@local',
      fullName: 'Guest',
      role: 'GUEST',
      isPremium: false,
      message: 'Guest session',
    };
    set({ user: guest, token: null });
  },
}));
