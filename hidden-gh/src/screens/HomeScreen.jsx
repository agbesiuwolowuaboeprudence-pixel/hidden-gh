import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── API CONFIG ──────────────────────────────────────────────────────────────
// Sign up free at unsplash.com/developers to get your own key
// Wikipedia needs no key at all

const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';

const UNSPLASH_BASE = 'https://api.unsplash.com';
const WIKIPEDIA_BASE = 'https://en.wikipedia.org/api/rest_v1';

// ─── FALLBACK DATA (shows instantly while API loads) ─────────────────────────

const FALLBACK_SITES = [
  {
    id: '1',
    name: 'Cape Coast Castle',
    location: 'Cape Coast, Central Region',
    category: 'Historical',
    rating: 4.8,
    entryFee: 'GHS 80',
    openingHours: '9:00 AM - 5:00 PM',
    isPremium: false,
    unsplashQuery: 'Cape Coast Castle Ghana',
    wikipediaTitle: 'Cape_Coast_Castle',
    image: 'https://images.unsplash.com/photo-1589825743636-4b8e933a0b4e?w=800&q=80',
    description: 'A UNESCO World Heritage Site and former slave trade fortress.',
  },
  {
    id: '2',
    name: 'Kakum National Park',
    location: 'Central Region, Ghana',
    category: 'Nature',
    rating: 4.7,
    entryFee: 'GHS 120',
    openingHours: '8:00 AM - 4:30 PM',
    isPremium: false,
    unsplashQuery: 'rainforest canopy walkway Ghana',
    wikipediaTitle: 'Kakum_National_Park',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    description: 'Famous canopy walkway 30 metres above the rainforest floor.',
  },
  {
    id: '3',
    name: 'Mole National Park',
    location: 'Damongo, Savannah Region',
    category: 'Wildlife',
    rating: 4.9,
    entryFee: 'GHS 150',
    openingHours: '6:00 AM - 6:00 PM',
    isPremium: false,
    unsplashQuery: 'elephants savanna Ghana wildlife',
    wikipediaTitle: 'Mole_National_Park',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
    description: "Ghana's largest wildlife refuge with over 93 mammal species.",
  },
  {
    id: '4',
    name: 'Labadi Beach',
    location: 'Accra, Greater Accra',
    category: 'Beach',
    rating: 4.5,
    entryFee: 'GHS 40',
    openingHours: '8:00 AM - 10:00 PM',
    isPremium: false,
    unsplashQuery: 'Ghana beach Accra tropical',
    wikipediaTitle: 'Labadi_Beach',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    description: 'Most popular beach in Accra, known for live music.',
  },
  {
    id: '5',
    name: 'Larabanga Mosque',
    location: 'Larabanga, Savannah Region',
    category: 'Cultural',
    rating: 4.6,
    entryFee: 'GHS 30',
    openingHours: 'Sunrise - Sunset',
    isPremium: true,
    unsplashQuery: 'ancient mosque West Africa mud brick',
    wikipediaTitle: 'Larabanga_Mosque',
    image: 'https://images.unsplash.com/photo-1545167496-c1e092d383a2?w=800&q=80',
    description: 'One of the oldest mosques in West Africa, built around 1421.',
  },
];

const CATEGORIES = ['All', 'Historical', 'Nature', 'Wildlife', 'Beach', 'Cultural'];

const QUICK_ACTIONS = [
  { id: 'talk',    icon: '🎥', label: 'Talk to\na Guide' },
  { id: 'message', icon: '💬', label: 'Message\na Guide' },
  { id: 'hotels',  icon: '🏨', label: 'Book\nHotels' },
  { id: 'stays',   icon: '🏡', label: 'Guide\nStays' },
  { id: 'map',     icon: '📍', label: 'View\nMap' },
];

// ─── COLORS ──────────────────────────────────────────────────────────────────

const C = {
  primary:       '#1B5E3B',
  primaryDark:   '#0F3D22',
  accent:        '#F5A623',
  white:         '#FFFFFF',
  black:         '#111111',
  bg:            '#F8F7F2',
  card:          '#FFFFFF',
  textPrimary:   '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted:     '#A0A0A0',
  border:        '#E8E8E8',
  premium:       '#C9A84C',
};

// ─── API HELPERS ─────────────────────────────────────────────────────────────

// Fetch one Unsplash image URL for a search query
async function fetchUnsplashImage(query) {
  try {
    const res = await fetch(
      `${UNSPLASH_BASE}/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
  } catch (e) {
    console.log('Unsplash error:', e.message);
  }
  return null;
}

// Fetch a short Wikipedia summary for a site
async function fetchWikipediaSummary(title) {
  try {
    const res = await fetch(`${WIKIPEDIA_BASE}/page/summary/${title}`);
    const data = await res.json();
    if (data.extract) {
      // Return just the first 2 sentences
      const sentences = data.extract.split('. ');
      return sentences.slice(0, 2).join('. ') + '.';
    }
  } catch (e) {
    console.log('Wikipedia error:', e.message);
  }
  return null;
}

// Fetch hero banner image from Unsplash
async function fetchHeroImage() {
  try {
    const res = await fetch(
      `${UNSPLASH_BASE}/search/photos?query=Ghana+tourism+landscape&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.full;
    }
  } catch (e) {
    console.log('Hero image error:', e.message);
  }
  return null;
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sites, setSites] = useState(FALLBACK_SITES);
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1589825743636-4b8e933a0b4e?w=1200&q=80'
  );
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Load real API data on mount
  useEffect(() => {
    loadAPIData();
  }, []);

  async function loadAPIData() {
    setLoading(true);
    try {
      // Fetch hero image
      const hero = await fetchHeroImage();
      if (hero) setHeroImage(hero);

      // Fetch images + descriptions for each site in parallel
      const enriched = await Promise.all(
        FALLBACK_SITES.map(async (site) => {
          const [imageUrl, description] = await Promise.all([
            fetchUnsplashImage(site.unsplashQuery),
            fetchWikipediaSummary(site.wikipediaTitle),
          ]);
          return {
            ...site,
            image: imageUrl || site.image,
            description: description || site.description,
          };
        })
      );
      setSites(enriched);
    } catch (e) {
      console.log('API load error:', e.message);
      // Falls back to FALLBACK_SITES already set
    } finally {
      setLoading(false);
    }
  }

  const filteredSites =
    selectedCategory === 'All'
      ? sites
      : sites.filter((s) => s.category === selectedCategory);

  const searchedSites = searchText.trim()
    ? filteredSites.filter((s) =>
        s.name.toLowerCase().includes(searchText.toLowerCase()) ||
        s.location.toLowerCase().includes(searchText.toLowerCase())
      )
    : filteredSites;

  const handleSitePress = (site) => {
    console.log('Pressed:', site.name);
    // navigation.navigate('SiteDetail', { site });
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HERO BANNER ── */}
        <View style={s.heroContainer}>
          <Image source={{ uri: heroImage }} style={s.heroImage} resizeMode="cover" />
          <View style={s.heroOverlay} />

          {/* Top bar */}
          <View style={s.heroTop}>
            <TouchableOpacity style={s.menuBtn}>
              <Text style={s.menuIcon}>☰</Text>
            </TouchableOpacity>
            <View style={s.logoWrap}>
              <Text style={s.logoHidden}>Hidden </Text>
              <Text style={s.logoGhana}>GH★NA</Text>
            </View>
            <View style={s.heroTopRight}>
              <TouchableOpacity><Text style={s.bellIcon}>🔔</Text></TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' }}
                  style={s.avatar}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero text */}
          <View style={s.heroContent}></View>
        </View>
      </ScrollView>
    </View>
  );
}