/**
 * Booking service — wraps /api/bookings endpoints (require auth JWT)
 */

import { bookings as mockBookings } from '../data/mockData';
import type { Booking, BookingStatus } from '../types';
import { ApiError, apiClient } from './api';

// ─── Request shape (mirrors BookingRequest.java) ──────────────────────────────
export interface CreateBookingPayload {
  bookingType: 'guide' | 'hotel';
  guideId?: number;
  hotelId?: number;
  siteId?: number;
  bookingDate: string; // ISO date: '2026-07-20'
  time: string;
  duration: string;
  amount: number;
}

// ─── Backend response shape ───────────────────────────────────────────────────
interface BackendBooking {
  id: number;
  bookingType: string;
  guideId?: number;
  hotelId?: number;
  siteId?: number;
  bookingDate: string;
  time: string;
  duration: string;
  amount: number;
  status: string;
  rating?: number;
  bookingRef: string;
}

function mapBooking(b: BackendBooking): Booking {
  return {
    id: String(b.id),
    type: b.bookingType === 'guide' ? 'guide' : 'hotel',
    guide: b.bookingType === 'guide' ? `Guide #${b.guideId}` : undefined,
    hotel: b.bookingType === 'hotel' ? `Hotel #${b.hotelId}` : undefined,
    site: b.siteId ? `Site #${b.siteId}` : '',
    date: b.bookingDate,
    time: b.time,
    duration: b.duration,
    amount: `GHS ${b.amount}`,
    status: b.status as BookingStatus,
    rating: b.rating ?? null,
    avatar: '',
    siteImage: '',
    bookingRef: b.bookingRef,
  };
}

// ─── Service functions ────────────────────────────────────────────────────────
export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const data = await apiClient.post<BackendBooking>('/api/bookings', payload);
  return mapBooking(data);
}

export async function getMyBookings(): Promise<Booking[]> {
  try {
    const data = await apiClient.get<BackendBooking[]>('/api/bookings/my-bookings');
    return data.map(mapBooking);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) throw err;
    console.warn('[bookingService] Backend unavailable, using mock data');
    return mockBookings;
  }
}

export async function getMyBookingsByStatus(status: BookingStatus): Promise<Booking[]> {
  try {
    const data = await apiClient.get<BackendBooking[]>(
      `/api/bookings/my-bookings/status/${status}`
    );
    return data.map(mapBooking);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) throw err;
    return mockBookings.filter((b) => b.status === status);
  }
}

export async function cancelBooking(id: string): Promise<Booking> {
  const data = await apiClient.put<BackendBooking>(`/api/bookings/${id}/cancel`, {});
  return mapBooking(data);
}

export async function rateBooking(id: string, rating: number): Promise<Booking> {
  const data = await apiClient.put<BackendBooking>(
    `/api/bookings/${id}/rate?rating=${rating}`,
    {}
  );
  return mapBooking(data);
}

export async function getBookingByRef(ref: string): Promise<Booking | null> {
  try {
    const data = await apiClient.get<BackendBooking>(`/api/bookings/ref/${ref}`);
    return mapBooking(data);
  } catch {
    return null;
  }
}
