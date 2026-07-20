/**
 * Site service — wraps /api/sites endpoints (public, no auth required)
 *
 * Falls back to local mockData when the backend is unreachable so the app
 * still works during development without the server running.
 */

import { touristSites as mockSites } from '../data/mockData';
import type { TouristSite } from '../types';
import { ApiError, apiClient } from './api';

// ─── Backend response shape ───────────────────────────────────────────────────
// The Spring entity uses different field names — map them to our frontend type.
interface BackendSite {
  id: number;
  name: string;
  location: string;
  region: string;
  description: string;
  longDescription?: string;
  category: string;
  entryFee: string;
  openingHours: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  isPremium: boolean;
  latitude?: number;
  longitude?: number;
  phone?: string;
}

function mapSite(s: BackendSite): TouristSite {
  return {
    id: String(s.id),
    name: s.name,
    location: s.location,
    region: s.region,
    description: s.description,
    longDescription: s.longDescription,
    category: s.category,
    entryFee: s.entryFee,
    openingHours: s.openingHours,
    rating: s.rating,
    reviews: s.reviews ?? 0,
    image: s.imageUrl,
    isPremium: s.isPremium,
    lat: s.latitude,
    lng: s.longitude,
    phone: s.phone,
  };
}

// ─── Service functions ────────────────────────────────────────────────────────
export async function getAllSites(): Promise<TouristSite[]> {
  try {
    const data = await apiClient.get<BackendSite[]>('/api/sites', true);
    return data.map(mapSite);
  } catch (err) {
    if (err instanceof ApiError && err.status >= 500) throw err;
    // Backend unreachable — use mock data
    console.warn('[siteService] Backend unavailable, using mock data');
    return mockSites;
  }
}

export async function getSiteById(id: string): Promise<TouristSite> {
  try {
    const data = await apiClient.get<BackendSite>(`/api/sites/${id}`, true);
    return mapSite(data);
  } catch {
    const found = mockSites.find((s) => s.id === id);
    if (!found) throw new Error(`Site ${id} not found`);
    return found;
  }
}

export async function getSitesByCategory(category: string): Promise<TouristSite[]> {
  try {
    const data = await apiClient.get<BackendSite[]>(`/api/sites/category/${category}`, true);
    return data.map(mapSite);
  } catch {
    return mockSites.filter((s) => s.category === category);
  }
}

export async function getSitesByRegion(region: string): Promise<TouristSite[]> {
  try {
    const data = await apiClient.get<BackendSite[]>(`/api/sites/region/${region}`, true);
    return data.map(mapSite);
  } catch {
    return mockSites.filter((s) => s.region === region);
  }
}

export async function searchSites(query: string): Promise<TouristSite[]> {
  try {
    const data = await apiClient.get<BackendSite[]>(`/api/sites/search?name=${encodeURIComponent(query)}`, true);
    return data.map(mapSite);
  } catch {
    const q = query.toLowerCase();
    return mockSites.filter(
      (s) => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
    );
  }
}

export async function getPremiumSites(): Promise<TouristSite[]> {
  try {
    const data = await apiClient.get<BackendSite[]>('/api/sites/premium', true);
    return data.map(mapSite);
  } catch {
    return mockSites.filter((s) => s.isPremium);
  }
}
