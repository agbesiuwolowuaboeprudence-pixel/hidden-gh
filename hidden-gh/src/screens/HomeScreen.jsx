import React, { useState } from 'react';
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

// ─── DATA ────────────────────────────────────────────────────────────────────

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
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&q=80',
    description: 'One of the oldest mosques in West Africa, built around 1421.',
  },
  {
    id: '6',
    name: 'Elmina Castle',
    location: 'Elmina, Central Region',
    category: 'Historical',
    rating: 4.7,
    entryFee: 'GHS 70',
    openingHours: '9:00 AM - 5:00 PM',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1580746738099-b2d424ea3bc8?w=600&q=80',
    description: 'The oldest European building in sub-Saharan Africa.',
  },
  {
    id: '7',
    name: 'Boti Falls',
    location: 'Boti, Eastern Region',
    category: 'Nature',
    rating: 4.5,
    entryFee: 'GHS 50',
    openingHours: '8:00 AM - 5:00 PM',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&q=80',
    description: 'A stunning twin waterfall in the Eastern Region.',
  },
  {
    id: '8',
    name: 'Lake Bosomtwe',
    location: 'Ashanti Region',
    category: 'Nature',
    rating: 4.7,
    entryFee: 'GHS 45',
    openingHours: '7:00 AM - 6:00 PM',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
    description: "Ghana's only natural lake formed by a meteorite impact.",
  },
];

const CATEGORIES = ['All', 'Historical', 'Nature', 'Wildlife', 'Beach', 'Cultural'];

const QUICK_ACTIONS = [
  { id: 'talk',    icon: '🎥', label: 'Talk to\na Guide' },
  { id: 'hotels',  icon: '🏨', label: 'Book\nHotels' },
  { id: 'stays',   icon: '🏡', label: 'Guide\nStays' },
];

// ─── HERO BANNER ─────────────────────────────────────────────────────────────

function HeroBanner({ searchText, setSearchText }) {
  return (
    <View style={styles.heroContainer}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80' }}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <View style={styles.heroOverlay} />

      <View style={styles.heroTop}>
        <TouchableOpacity style={styles.menuBtn}>
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
        <Text style={styles.heroTitle}>Explore Ghana's{'\n'}Hidden Treasures</Text>
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

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>200+</Text>
          <Text style={styles.statLabel}>Sites</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statLabel}>Guides</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>16</Text>
          <Text style={styles.statLabel}>Regions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4.8★</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
    </View>
  );
}

// ─── PREMIUM BANNER ───────────────────────────────────────────────────────────

function PremiumBanner() {
  return (
    <View style={styles.premiumBanner}>
      <View style={styles.premiumLeft}>
        <Text style={styles.premiumCrown}>👑</Text>
        <View style={styles.premiumTextWrap}>
          <Text style={styles.premiumTitle}>Unlock the True History of Ghana</Text>
          <Text style={styles.premiumDesc}>
            In-depth history, 3D tours, VR experiences and more.
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.premiumBtn}>
        <Text style={styles.premiumBtnText}>Go Premium</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── QUICK ACTIONS ────────────────────────────────────────────────────────────

function QuickActions({ navigation }) {
  return (
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
            onPress={() => {
              if (action.id === 'talk' || action.id === 'message') {
                navigation.navigate('GuideList');
              } else if (action.id === 'hotels' || action.id === 'stays') {
                navigation.navigate('Bookings');
              } else if (action.id === 'map') {
                navigation.navigate('Map');
              }
            }}
          >
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>{action.icon}</Text>
            </View>
            <Text style={styles.quickActionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sites]                                 = useState(FALLBACK_SITES);
  const [loading]                               = useState(false);
  const [searchText, setSearchText]             = useState('');

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
    navigation.navigate('SiteDetail', { site });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false}>

        <HeroBanner searchText={searchText} setSearchText={setSearchText} />

        <View style={styles.body}>

          {/* CATEGORY PILLS */}
          <View style={styles.pillsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillsRow}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.pill,
                    selectedCategory === cat && styles.pillActive,
                  ]}
                >
                  <Text style={[
                    styles.pillText,
                    selectedCategory === cat && styles.pillTextActive,
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* POPULAR DESTINATIONS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Destinations</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
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
                        <Text style={styles.premiumBadgeText}>Premium</Text>
                      </View>
                    )}
                    <TouchableOpacity style={styles.heartBtn}>
                      <Text style={styles.heartIcon}>♡</Text>
                    </TouchableOpacity>
                    <View style={styles.siteCardInfo}>
                      <Text style={styles.siteCardName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.siteCardDesc} numberOfLines={2}>
                        {item.description}
                      </Text>
                      <View style={styles.siteCardMeta}>
                        <Text style={styles.siteCardLocation} numberOfLines={1}>
                          {item.location}
                        </Text>
                      </View>
                      <View style={styles.siteCardBottom}>
                        <Text style={styles.ratingText}>★ {item.rating}</Text>
                        <Text style={styles.feeText}>{item.entryFee}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          {/* PREMIUM BANNER */}
          <PremiumBanner />

          {/* QUICK ACTIONS */}
          <QuickActions navigation={navigation} />

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Hero
  heroContainer: {
    width: '100%',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  menuBtn:    { padding: 4 },
  menuIcon:   { fontSize: 20, color: C.white },
  logoWrap:   { flexDirection: 'row', alignItems: 'baseline' },
  logoHidden: { fontSize: 18, color: C.white, fontStyle: 'italic', fontWeight: '600' },
  logoGhana:  { fontSize: 20, color: C.accent, fontWeight: '800', letterSpacing: 1 },
  heroTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellIcon: { fontSize: 18 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: C.white,
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  heroTagline: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C.white,
    lineHeight: 28,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 8,
  },
  searchIcon:  { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 13, color: C.textPrimary },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: { fontSize: 16, color: C.white },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 0.5,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: C.white,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },

  // Body
  body: { flex: 1 },

  // Category pills
  pillsContainer: {
    height: 52,
    justifyContent: 'center',
    backgroundColor: C.bg,
  },
  pillsRow: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
    height: 52,
  },
  pill: {
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive:     { backgroundColor: C.primary, borderColor: C.primary },
  pillText:       { fontSize: 12, color: C.textSecondary, fontWeight: '600' },
  pillTextActive: { color: C.white, fontWeight: '700' },

  // Section
  section: { marginBottom: 24 },
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

  // Site card
  siteCard: {
    width: 200,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: C.card,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  siteCardImage: { width: '100%', height: 130 },
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
  siteCardMeta:     { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  siteCardLocation: { fontSize: 11, color: C.textMuted, flex: 1 },
  siteCardBottom:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingText:       { fontSize: 11, color: C.textSecondary, fontWeight: '600' },
  feeText:          { fontSize: 11, color: C.primary, fontWeight: '700' },

  // Premium banner
  premiumBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#0F3D22',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  premiumLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  premiumCrown:    { fontSize: 28 },
  premiumTextWrap: { flex: 1 },
  premiumTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: C.white,
    marginBottom: 3,
    lineHeight: 18,
  },
  premiumDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 15,
  },
  premiumBtn: {
    backgroundColor: C.accent,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexShrink: 0,
  },
  premiumBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.black,
  },

  // Quick actions
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  quickAction: { alignItems: 'center', gap: 8 },
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