/**
 * User service — wraps /api/users endpoints (require auth JWT)
 */

import { userProfile as mockProfile } from '../data/mockData';
import type { UserProfile } from '../types';
import { ApiError, apiClient } from './api';

// ─── Backend user shape (mirrors User.java) ───────────────────────────────────
interface BackendUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  isPremium: boolean;
  createdAt: string;
}

function mapUser(u: BackendUser): UserProfile {
  return {
    name: u.fullName,
    email: u.email,
    phone: u.phone ?? '',
    location: u.location ?? '',
    memberSince: u.createdAt
      ? new Date(u.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
      : '',
    isPremium: u.isPremium,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=1a6b3c&color=fff&size=200`,
    stats: {
      sitesVisited: 0,
      savedSites: 0,
      toursBooked: 0,
      reviews: 0,
    },
  };
}

// ─── Service functions ────────────────────────────────────────────────────────
export async function getProfile(): Promise<UserProfile> {
  try {
    const data = await apiClient.get<BackendUser>('/api/users/profile');
    return mapUser(data);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) throw err;
    console.warn('[userService] Backend unavailable, using mock profile');
    return mockProfile;
  }
}

export interface UpdateProfilePayload {
  fullName: string;
  phone: string;
  location: string;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  const data = await apiClient.put<BackendUser>('/api/users/profile', payload);
  return mapUser(data);
}

export async function upgradeToPremium(): Promise<UserProfile> {
  const data = await apiClient.put<BackendUser>('/api/users/upgrade-premium', {});
  return mapUser(data);
}
