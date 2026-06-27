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
  FlatList,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── DATA ────────────────────────────────────────────────────────────────────

const ALL_SITES = [
  {
    id: '1',
    name: 'Cape Coast Castle',
    location: 'Cape Coast, Central Region',
    category: 'Historical',
    rating: 4.8,
    reviews: 2341,
    entryFee: 'GHS 80',
    openingHours: '9:00 AM - 5:00 PM',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    description: 'A UNESCO World Heritage Site and former slave trade fortress built by the Swedes in 1653.',
  },
  {
    id: '2',
    name: 'Kakum National Park',
    location: 'Assin Attandanso, Central Region',
    category: 'Nature',
    rating: 4.7,
    reviews: 1892,
    entryFee: 'GHS 120',
    openingHours: '8:00 AM - 4:30 PM',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    description: 'Famous canopy walkway suspended 30 metres above the rainforest floor.',
  },
  {
    id: '3',
    name: 'Mole National Park',
    location: 'Damongo, Savannah Region',
    category: 'Wildlife',
    rating: 4.9,
    reviews: 3102,
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
    reviews: 4200,
    entryFee: 'GHS 40',
    openingHours: '8:00 AM - 10:00 PM',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    description: 'Most popular beach in Accra, known for live music and vibrant atmosphere.',
  },
  {
    id: '5',
    name: 'Larabanga Mosque',
    location: 'Larabanga, Savannah Region',
    category: 'Cultural',
    rating: 4.6,
    reviews: 876,
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
    reviews: 1654,
    entryFee: 'GHS 70',
    openingHours: '9:00 AM - 5:00 PM',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1580746738099-b2d424ea3bc8?w=600&q=80',
    description: 'The oldest European building in sub-Saharan Africa, built by the Portuguese in 1482.',
  },
  {
    id: '7',
    name: 'Boti Falls',
    location: 'Boti, Eastern Region',
    category: 'Nature',
    rating: 4.5,
    reviews: 987,
    entryFee: 'GHS 50',
    openingHours: '8:00 AM - 5:00 PM',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&q=80',
    description: 'A stunning twin waterfall located in the heart of the Eastern Region.',
  },
  {
    id: '8',
    name: 'Kwame Nkrumah Memorial',
    location: 'Accra, Greater Accra',
    category: 'Historical',
    rating: 4.6,
    reviews: 2100,
    entryFee: 'GHS 60',
    openingHours: '9:00 AM - 5:00 PM',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=600&q=80',
    description: "Mausoleum and museum dedicated to Ghana's first president.",
  },
  {
    id: '9',
    name: 'Lake Bosomtwe',
    location: 'Ashanti Region',
    category: 'Nature',
    rating: 4.7,
    reviews: 1340,
    entryFee: 'GHS 45',
    openingHours: '7:00 AM - 6:00 PM',
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
    description: "Ghana's only natural lake, formed by a meteorite impact.",
  },
  {
    id: '10',
    name: 'Paga Crocodile Pond',
    location: 'Paga, Upper East Region',
    category: 'Wildlife',
    rating: 4.4,
    reviews: 654,
    entryFee: 'GHS 35',
    openingHours: '8:00 AM - 5:00 PM',
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    description: 'Sacred crocodile pond where tourists interact freely with wild crocodiles.',
  },
];

// ── No icons — text only for reliable Android rendering ──
const CATEGORIES = [
  { id: 'all',        icon: 'apps-outline', label: 'All'      },
  { id: 'Historical', icon:'library-outline', label: 'History'  },
  { id: 'Nature',     icon:'leaf-outline', label: 'Nature'   },
  { id: 'Wildlife',   icon:'paw-outline', label: 'Wildlife' },
  { id: 'Beach',      icon:'beach', label: 'Beach'    },
  { id: 'Cultural',   icon: 'drum', label: 'Cultural'  },
];

const REGIONS = ['All Regions', 'Central', 'Greater Accra', 'Savannah', 'Eastern', 'Ashanti', 'Upper East','Western', 'Volta', 'Northern', 'Upper West'];

const SORT_OPTIONS = ['Top Rated', 'Most Reviewed', 'Lowest Fee', 'A - Z'];

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

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function ExploreScreen({ navigation }) {
  const [searchText, setSearchText]             = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion]     = useState('All Regions');
  const [selectedSort, setSelectedSort]         = useState('Top Rated');
  const [showFilters, setShowFilters]           = useState(false);
  const [viewMode, setViewMode]                 = useState('grid');

  // ── Filter + Sort logic ──
  let results = ALL_SITES;

  if (searchText.trim()) {
    results = results.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.location.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  if (selectedCategory !== 'all') {
    results = results.filter((item) => item.category === selectedCategory);
  }

  if (selectedRegion !== 'All Regions') {
    results = results.filter((item) => item.location.includes(selectedRegion));
  }

  if (selectedSort === 'Top Rated') {
    results = [...results].sort((a, b) => b.rating - a.rating);
  } else if (selectedSort === 'Most Reviewed') {
    results = [...results].sort((a, b) => b.reviews - a.reviews);
  } else if (selectedSort === 'Lowest Fee') {
    results = [...results].sort(
      (a, b) =>
        parseInt(a.entryFee.replace('GHS ', '')) -
        parseInt(b.entryFee.replace('GHS ', ''))
    );
  } else if (selectedSort === 'A - Z') {
    results = [...results].sort((a, b) => a.name.localeCompare(b.name));
  }

  const handleSitePress = (site) => {
    navigation.navigate('SiteDetail', { site });
  };

  // ── Grid card ──
  const GridCard = ({ item }) => (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={() => handleSitePress(item)}
      activeOpacity={0.88}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.gridImage}
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
      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.gridLocation} numberOfLines={1}>
          {item.location}
        </Text>
        <View style={styles.gridBottom}>
          <Text style={styles.gridRating}>★ {item.rating}</Text>
          <Text style={styles.gridFee}>{item.entryFee}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // ── List card ──
  const ListCard = ({ item }) => (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => handleSitePress(item)}
      activeOpacity={0.88}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.listImage}
        resizeMode="cover"
      />
      {item.isPremium && (
        <View style={styles.listPremiumBadge}>
          <Text style={styles.premiumBadgeText}>Premium</Text>
        </View>
      )}
      <View style={styles.listInfo}>
        <View style={styles.listTop}>
          <Text style={styles.listCategory}>{item.category}</Text>
          {item.isPremium && (
            <Text style={styles.listPremiumText}>Premium</Text>
          )}
        </View>
        <Text style={styles.listName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.listDesc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.listLocation}>{item.location}</Text>
        <View style={styles.listBottom}>
          <Text style={styles.listRating}>
            ★ {item.rating} ({item.reviews.toLocaleString()})
          </Text>
          <Text style={styles.listFee}>{item.entryFee}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Explore Ghana</Text>
          <Text style={styles.headerSub}>{results.length} destinations found</Text>
        </View>
        <TouchableOpacity
          style={styles.viewToggle}
          onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          <Text style={styles.viewToggleText}>
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── SEARCH BAR ── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search sites, regions, categories..."
            placeholderTextColor={C.textMuted}
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={styles.clearText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, showFilters && styles.filterBtnActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={[
            styles.filterBtnText,
            showFilters && styles.filterBtnTextActive,
          ]}>
            Filter
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── CATEGORY PILLS ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategory(cat.id)}
            style={[
              styles.pill,
              selectedCategory === cat.id && styles.pillActive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                selectedCategory === cat.id && styles.pillTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── FILTER PANEL ── */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>Region</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 12 }}
          >
            <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 4 }}>
              {REGIONS.map((region) => (
                <TouchableOpacity
                  key={region}
                  onPress={() => setSelectedRegion(region)}
                  style={[
                    styles.filterChip,
                    selectedRegion === region && styles.filterChipActive,
                  ]}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedRegion === region && styles.filterChipTextActive,
                  ]}>
                    {region}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.filterLabel}>Sort By</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setSelectedSort(option)}
                style={[
                  styles.filterChip,
                  selectedSort === option && styles.filterChipActive,
                ]}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedSort === option && styles.filterChipTextActive,
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ── RESULTS ── */}
      {results.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySub}>Try a different search or filter</Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setSearchText('');
              setSelectedCategory('all');
              setSelectedRegion('All Regions');
            }}
          >
            <Text style={styles.resetBtnText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      ) : viewMode === 'grid' ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <GridCard item={item} />}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ListCard item={item} />}
        />
      )}
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 12,
    backgroundColor: C.bg,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.textPrimary },
  headerSub:   { fontSize: 12, color: C.textMuted, marginTop: 2 },
  viewToggle: {
    backgroundColor: C.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewToggleText: { fontSize: 12, color: C.white, fontWeight: '600' },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.textPrimary,
  },
  clearText: {
    fontSize: 14,
    color: C.textMuted,
    paddingHorizontal: 4,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 28,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  filterBtnText: {
    fontSize: 13,
    color: C.textSecondary,
    fontWeight: '600',
  },
  filterBtnTextActive: {
    color: C.white,
  },

  // Pills
  pillsRow: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 4,
    gap: 10,
  },
  pill: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  pillActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  pillText: {
    fontSize: 14,
    color: C.textSecondary,
    fontWeight: '600',
  },
  pillTextActive: {
    color: C.white,
    fontWeight: '700',
  },

  // Filter panel
  filterPanel: {
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: C.bg,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  filterChipActive:     { backgroundColor: C.primary, borderColor: C.primary },
  filterChipText:       { fontSize: 12, color: C.textSecondary },
  filterChipTextActive: { color: C.white, fontWeight: '600' },

  // Grid
  gridContainer: { paddingHorizontal: 12, paddingBottom: 100 },
  gridRow:       { justifyContent: 'space-between', marginBottom: 12 },
  gridCard: {
    width: (width - 36) / 2,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: C.card,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  gridImage:    { width: '100%', height: 130 },
  gridInfo:     { padding: 10 },
  gridName:     { fontSize: 13, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
  gridLocation: { fontSize: 10, color: C.textMuted, marginBottom: 6 },
  gridBottom:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gridRating:   { fontSize: 11, color: C.textSecondary, fontWeight: '600' },
  gridFee:      { fontSize: 11, color: C.primary, fontWeight: '700' },

  // Badges
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: C.premium,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  premiumBadgeText: {
    fontSize: 10,
    color: C.white,
    fontWeight: '700',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: { fontSize: 14, color: C.textPrimary },

  // List
  listContainer: { paddingHorizontal: 16, paddingBottom: 100 },
  listCard: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  listImage: { width: 110, height: 130 },
  listPremiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: C.premium,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  listInfo:        { flex: 1, padding: 12, justifyContent: 'space-between' },
  listTop:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  listCategory:    { fontSize: 10, color: C.primary, fontWeight: '700', textTransform: 'uppercase' },
  listPremiumText: { fontSize: 10, color: C.premium, fontWeight: '700' },
  listName:        { fontSize: 14, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
  listDesc:        { fontSize: 11, color: C.textSecondary, lineHeight: 15, marginBottom: 6 },
  listLocation:    { fontSize: 11, color: C.textMuted, marginBottom: 6 },
  listBottom:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listRating:      { fontSize: 11, color: C.textSecondary },
  listFee:         { fontSize: 12, color: C.primary, fontWeight: '700' },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
  emptySub:   { fontSize: 13, color: C.textMuted },
  resetBtn: {
    marginTop: 8,
    backgroundColor: C.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetBtnText: { fontSize: 13, color: C.white, fontWeight: '600' },
});