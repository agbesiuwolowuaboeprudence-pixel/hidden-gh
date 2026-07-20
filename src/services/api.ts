/**
 * Base API client for Hidden Ghana backend (http://localhost:8080)
 *
 * - Automatically attaches the JWT Bearer token from secure storage
 * - Parses JSON responses and surfaces typed ApiError on non-2xx
 * - Exported `apiClient` is the single entry-point used by every service
 */

import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// ─── Config ──────────────────────────────────────────────────────────────────
import { Platform } from 'react-native';

// Auto-detect the dev machine's IP from the Expo dev-server connection so the
// app reaches the backend whether it runs on a physical device (Expo Go), an
// Android emulator (10.0.2.2), or an iOS simulator (localhost). Deriving the
// host from `hostUri` also survives LAN IP changes — the device is already
// talking to the dev server at that address.
// Override manually with `expo.extra.apiBaseUrl` in app.json if needed.
function resolveBaseUrl(): string {
  const expoConfig = (Constants?.expoConfig ?? (Constants?.manifest as any)) as
    | { hostUri?: string; extra?: { apiBaseUrl?: string } }
    | undefined;

  const hostUri = expoConfig?.hostUri;
  const lanHost = typeof hostUri === 'string' ? hostUri.split(':')[0] : undefined;
  if (lanHost) return `http://${lanHost}:8080`;

  const manual = expoConfig?.extra?.apiBaseUrl;
  if (manual) return manual;

  return Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
}

export const BASE_URL = resolveBaseUrl();

// Helpful debug log so the running app shows which backend URL it's using.
try {
  // eslint-disable-next-line no-console
  console.log('[api] BASE_URL =', BASE_URL);
} catch (e) {}

const REQUEST_TIMEOUT_MS = 10000;

export const TOKEN_KEY = 'hg_auth_token';

// ─── Types ───────────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: Method;
  body?: unknown;
  /** Set to true for endpoints that don't require a token (auth / public routes) */
  public?: boolean;
}

// ─── Core request helper ─────────────────────────────────────────────────────
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, public: isPublic = false } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (!isPublic) {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    // 204 No Content — no body to parse
    if (response.status === 204) return undefined as T;

    let data: unknown;
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'message' in data
          ? String((data as { message: string }).message)
          : `HTTP ${response.status}`;
      throw new ApiError(response.status, message, data);
    }

    return data as T;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError(408, 'Request timed out while contacting the backend');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

}

// ─── Exported client ─────────────────────────────────────────────────────────
export const apiClient = {
  get<T>(path: string, isPublic = false) {
    return request<T>(path, { method: 'GET', public: isPublic });
  },
  post<T>(path: string, body: unknown, isPublic = false) {
    return request<T>(path, { method: 'POST', body, public: isPublic });
  },
  put<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'PUT', body });
  },
  delete<T>(path: string) {
    return request<T>(path, { method: 'DELETE' });
  },
};
