/**
 * Auth service — wraps /api/auth endpoints
 * Handles token persistence in SecureStore.
 */

import * as SecureStore from 'expo-secure-store';
import { ApiError, apiClient, TOKEN_KEY } from './api';

// ─── Request / response shapes (mirror the Java DTOs) ────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
}

export interface AuthUser {
  token: string;
  email: string;
  fullName: string;
  role: string;
  isPremium: boolean;
  message?: string;
}

function buildOfflineUser(email: string, fullName?: string): AuthUser {
  return {
    token: 'offline-demo-token',
    email: email || 'demo@hiddenghana.com',
    fullName: fullName || 'Demo User',
    role: 'USER',
    isPremium: false,
    message: 'Offline demo mode',
  };
}

// ─── Service functions ────────────────────────────────────────────────────────
export async function login(payload: LoginPayload): Promise<AuthUser> {
  const data = await apiClient.post<AuthUser>('/api/auth/login', payload, true);
  await SecureStore.setItemAsync(TOKEN_KEY, data.token);
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const data = await apiClient.post<AuthUser>('/api/auth/register', payload, true);
  await SecureStore.setItemAsync(TOKEN_KEY, data.token);
  return data;
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function socialLogin(provider: 'google' | 'apple', idToken: string): Promise<AuthUser> {
  const data = await apiClient.post<AuthUser>(`/api/auth/oauth/${provider}`, { idToken }, true);
  await SecureStore.setItemAsync(TOKEN_KEY, data.token);
  return data;
}

export async function checkHealth(): Promise<string> {
  return apiClient.get<string>('/api/auth/health', true);
}
