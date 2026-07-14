-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone VARCHAR(30),
  location VARCHAR(120),
  avatar_data BYTEA,
  avatar_mime_type VARCHAR(50),
  is_premium BOOLEAN DEFAULT FALSE,
  member_since TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(30) PRIMARY KEY,
  label VARCHAR(60) NOT NULL,
  icon VARCHAR(60) NOT NULL,
  color VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS tourist_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  location VARCHAR(200),
  description TEXT,
  long_description TEXT,
  category_id VARCHAR(30) REFERENCES categories(id),
  region VARCHAR(60),
  opening_hours VARCHAR(100),
  entry_fee VARCHAR(50),
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image_data BYTEA,
  image_mime_type VARCHAR(50),
  is_premium BOOLEAN DEFAULT FALSE,
  premium_content TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  phone VARCHAR(30),
  website VARCHAR(200),
  highlights TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES tourist_sites(id) ON DELETE CASCADE,
  image_data BYTEA NOT NULL,
  image_mime_type VARCHAR(50),
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  region VARCHAR(60),
  speciality VARCHAR(120),
  bio TEXT,
  languages TEXT[],
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  tours_completed INTEGER DEFAULT 0,
  experience VARCHAR(60),
  price VARCHAR(50),
  avatar_data BYTEA,
  avatar_mime_type VARCHAR(50),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guide_sites (
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  site_id UUID REFERENCES tourist_sites(id) ON DELETE CASCADE,
  PRIMARY KEY (guide_id, site_id)
);

CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  location VARCHAR(200),
  price NUMERIC(10,2),
  currency VARCHAR(10) DEFAULT 'GHS',
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image_data BYTEA,
  image_mime_type VARCHAR(50),
  amenities TEXT[],
  type VARCHAR(60),
  near_site_id UUID REFERENCES tourist_sites(id),
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

DO $$ BEGIN
  CREATE TYPE booking_type AS ENUM ('guide', 'hotel');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('Upcoming', 'Completed', 'Cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type booking_type NOT NULL,
  guide_id UUID REFERENCES guides(id),
  hotel_id UUID REFERENCES hotels(id),
  site_id UUID REFERENCES tourist_sites(id),
  booking_date DATE,
  booking_time VARCHAR(20),
  duration VARCHAR(30),
  amount NUMERIC(10,2),
  status booking_status DEFAULT 'Upcoming',
  rating INTEGER,
  booking_ref VARCHAR(30) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_sites (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES tourist_sites(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, site_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES tourist_sites(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(160),
  body TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed categories to match the frontend's mockData.ts
INSERT INTO categories (id, label, icon, color) VALUES
  ('Historical', 'History', 'library-outline', '#E53935'),
  ('Nature', 'Nature', 'leaf-outline', '#2E7D52'),
  ('Wildlife', 'Wildlife', 'paw-outline', '#F57F17'),
  ('Beach', 'Beach', 'water-outline', '#1565C0'),
  ('Cultural', 'Cultural', 'color-palette-outline', '#6A1B9A')
ON CONFLICT (id) DO NOTHING;
