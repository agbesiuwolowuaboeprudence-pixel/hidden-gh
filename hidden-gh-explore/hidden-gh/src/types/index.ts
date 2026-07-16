export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface TouristSite {
  id: string;
  name: string;
  location: string;
  description: string;
  longDescription?: string;
  category: string;
  region?: string;
  openingHours: string;
  entryFee: string;
  rating: number;
  reviews: number;
  image: string;
  gallery?: string[];
  isPremium: boolean;
  coordinates?: Coordinates;
  lat?: number;
  lng?: number;
  color?: string;
  phone?: string;
  website?: string;
  highlights?: string[];
  premiumContent?: string;
}

export interface Guide {
  id: string;
  name: string;
  region: string;
  speciality: string;
  rating: number;
  reviews: number;
  languages: string[];
  available: boolean;
  avatar: string;
  bio: string;
  tours?: number;
  experience?: string;
  sites?: string[];
  price?: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number | string;
  currency?: string;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  type: string;
  nearSites?: string;
  available?: boolean;
  featured?: boolean;
}

export type BookingStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  type: 'guide' | 'hotel';
  guide?: string;
  hotel?: string;
  site: string;
  date: string;
  time: string;
  duration: string;
  amount: string;
  status: BookingStatus;
  rating: number | null;
  avatar: string;
  siteImage: string;
  bookingRef: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
  isPremium: boolean;
  avatar: string;
  stats: {
    sitesVisited: number;
    savedSites: number;
    toursBooked: number;
    reviews: number;
  };
}

export interface Category {
  id: string;
  label: string;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
}
