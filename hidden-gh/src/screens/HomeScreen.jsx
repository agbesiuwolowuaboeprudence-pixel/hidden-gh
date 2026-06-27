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

const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';
const UNSPLASH_BASE = 'https://api.unsplash.com';
const WIKIPEDIA_BASE = 'https://en.wikipedia.org/api/rest_v1';

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
    unsplashQuery: 'elephants savanna Africa wildlife',
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
    unsplashQuery: 'tropical beach Africa sunny',
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
    unsplashQuery: 'ancient mud mosque West Africa',
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

async function fetchWikipediaSummary(title) {
  try {
    const res = await fetch(`${WIKIPEDIA_BASE}/page/summary/${title}`);
    const data = await res.json();
    if (data.extract) {
      const sentences = data.extract.split('. ');
      return sentences.slice(0, 2).join('. ') + '.';
    }
  } catch (e) {
    console.log('Wikipedia error:', e.message);
  }
  return null;
}

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sites, setSites] = useState(FALLBACK_SITES);
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1589825743636-4b8e933a0b4e?w=1200&q=80'
  );
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredSites =
    selectedCategory === 'All'
      ? sites
      : sites.filter((item) => item.category === selectedCategory);

  const searchedSites = searchText.trim()
    ? filteredSites.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.location.toLowerCase().includes(searchText.toLowerCase())
      )
    : filteredSites;

  const handleSitePress = (site) => {
    console.log('Pressed:', site.name);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HERO */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: heroImage }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />

          <View style={styles.heroTop}>
            <TouchableOpacity>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <View style={styles.logoWrap}>
              <Text style={styles.logoHidden}>Hidden </Text>
              <Text style={styles.logoGhana}>GH★NA</Text>
            </View>
            <View style={styles.heroTopRight}>
              <Text style={styles.bellIcon}>🔔</Text>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' }}
                style={styles.avatar}
              />
            </View>
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTagline}>Discover. Explore. Experience.</Text>
            <Text style={styles.heroTitle}>
              Explore the Beauty,{'\n'}History & Culture{'\n'}of Ghana
            </Text>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                placeholder="Search tourist sites, cities, hotels..."
                placeholderTextColor={C.textMuted}
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Text style={{ fontSize: 16, color: C.textMuted }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.filterBtn}>
              <Text style={styles.filterIcon}>⚙</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.body}>

          {/* CATEGORY PILLS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.pill, selectedCategory === cat && styles.pillActive]}
              >
                <Text style={[styles.pillText, selectedCategory === cat && styles.pillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* POPULAR DESTINATIONS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Destinations</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All ›</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={C.primary} size="small" />
                <Text style={styles.loadingText}>Loading destinations...</Text>
              </View>
            ) : (
              <FlatList
                data={searchedSites}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No sites match your search.</Text>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.siteCard}
                    onPress={() => handleSitePress(item)}
                    activeOpacity={0.88}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={styles.siteCardImage}
                      resizeMode="cover"
                    />
                    {item.isPremium && (
                      <View style={styles.premiumBadge}>
                        <Text style={styles.premiumBadgeText}>👑 Premium</Text>
                      </View>
                    )}
                    <TouchableOpacity style={styles.heartBtn}>
                      <Text style={styles.heartIcon}>♡</Text>
                    </TouchableOpacity>
                    <View style={styles.siteCardInfo}>
                      <Text style={styles.siteCardName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.siteCardDesc} numberOfLines={2}>{item.description}</Text>
                      <View style={styles.siteCardMeta}>
                        <Text style={styles.locationPin}>📍</Text>
                        <Text style={styles.siteCardLocation} numberOfLines={1}>
                          {item.location}
                        </Text>
                      </View>
                      <View style={styles.siteCardBottom}>
                        <Text style={styles.ratingText}>⭐ {item.rating}</Text>
                        <Text style={styles.feeText}>{item.entryFee}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          {/* PREMIUM BANNER */}
          <View style={styles.premiumBanner}>
            <View style={styles.premiumLeft}>
              <Text style={styles.premiumCrown}>👑</Text>
              <Text style={styles.premiumTitle}>Unlock the True{'\n'}History of Ghana</Text>
              <Text style={styles.premiumDesc}>
                Subscribe to access in-depth history, 3D tours, VR experiences and more.
              </Text>
              <TouchableOpacity style={styles.premiumBtn}>
                <Text style={styles.premiumBtnText}>Go Premium  ›</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.premiumRight}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1608037521244-f1c6c7635194?w=400&q=80' }}
                style={styles.premiumImage}
                resizeMode="cover"
              />
              <View style={styles.premiumTag3D}>
                <Text style={styles.premiumTag3DText}>3D</Text>
              </View>
            </View>
          </View>

          {/* QUICK ACTIONS */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { paddingHorizontal: 16, marginBottom: 14 }]}>
              What would you like to do?
            </Text>
            <View style={styles.quickActionsRow}>
              {QUICK_ACTIONS.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickAction}
                  activeOpacity={0.75}
                >
                  <View style={styles.quickActionIcon}>
                    <Text style={styles.quickActionEmoji}>{action.icon}</Text>
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  heroContainer: { width: '100%', height: 490 },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
  },
  menuIcon:   { fontSize: 22, color: C.white },
  logoWrap:   { flexDirection: 'row', alignItems: 'baseline' },
  logoHidden: { fontSize: 20, color: C.white, fontStyle: 'italic', fontWeight: '600' },
  logoGhana:  { fontSize: 22, color: C.accent, fontWeight: '800', letterSpacing: 1 },
  heroTopRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bellIcon:   { fontSize: 20 },
  avatar:     { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: C.white },

  heroContent:  { paddingHorizontal: 20, paddingTop: 44 },
  heroTagline:  { fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: 1.5, marginBottom: 8 },
  heroTitle:    { fontSize: 28, fontWeight: '700', color: C.white, lineHeight: 36 },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon:  { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 13, color: C.textPrimary },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: { fontSize: 18, color: C.white },

  body: { flex: 1 },

  pillsRow: { paddingHorizontal: 16, paddingVertical: 16, gap: 8 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  pillActive:     { backgroundColor: C.primary, borderColor: C.primary },
  pillText:       { fontSize: 13, color: C.textSecondary, fontWeight: '500' },
  pillTextActive: { color: C.white },

  section:       { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.textPrimary },
  viewAll:      { fontSize: 13, color: C.primary, fontWeight: '600' },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    height: 180,
  },
  loadingText: { fontSize: 13, color: C.textMuted },
  emptyText:   { fontSize: 13, color: C.textMuted, paddingHorizontal: 16 },

  siteCard: {
    width: 200,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: C.card,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  siteCardImage: { width: '100%', height: 100, borderTopLeftRadius: 14, borderTopRightRadius: 14 },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: C.premium,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  premiumBadgeText: { fontSize: 10, color: C.white, fontWeight: '700' },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon:        { fontSize: 16 },
  siteCardInfo:     { padding: 10 },
  siteCardName:     { fontSize: 13, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
  siteCardDesc:     { fontSize: 11, color: C.textSecondary, lineHeight: 15, marginBottom: 6 },
  siteCardMeta:     { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  locationPin:      { fontSize: 11 },
  siteCardLocation: { fontSize: 11, color: C.textMuted, flex: 1 },
  siteCardBottom:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingText:       { fontSize: 11, color: C.textSecondary, fontWeight: '600' },
  feeText:          { fontSize: 11, color: C.primary, fontWeight: '700' },

  premiumBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#0F3D22',
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 160,
  },
  premiumLeft:   { flex: 1, padding: 18, justifyContent: 'center' },
  premiumCrown:  { fontSize: 22, marginBottom: 6 },
  premiumTitle:  { fontSize: 16, fontWeight: '800', color: C.white, lineHeight: 22, marginBottom: 6 },
  premiumDesc:   { fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 16, marginBottom: 14 },
  premiumBtn: {
    backgroundColor: C.accent,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  premiumBtnText: { fontSize: 12, fontWeight: '700', color: C.black },
  premiumRight:   { width: 130 },
  premiumImage:   { width: '100%', height: '100%' },
  premiumTag3D: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  premiumTag3DText: { fontSize: 12, fontWeight: '800', color: C.white },

  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  quickAction:      { alignItems: 'center', gap: 8 },
  quickActionIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionEmoji: { fontSize: 22 },
  quickActionLabel: {
    fontSize: 11,
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
    fontWeight: '500',
  },
});