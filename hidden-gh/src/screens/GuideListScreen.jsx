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
  online:        '#2E7D52',
  offline:       '#A0A0A0',
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const ALL_GUIDES = [
  {
    id: 'g1',
    name: 'Kwame Asante',
    region: 'Central Region',
    speciality: 'History & Slave Trade',
    rating: 4.9,
    reviews: 312,
    languages: ['English', 'Twi', 'Fante'],
    available: true,
    tours: 148,
    experience: '8 years',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    bio: 'Licensed tour guide specialising in Cape Coast Castle and Elmina. Passionate about sharing Ghana\'s history with visitors from around the world.',
    sites: ['Cape Coast Castle', 'Elmina Castle', 'Kakum National Park'],
    price: 'GHS 150/hr',
  },
  {
    id: 'g2',
    name: 'Abena Mensah',
    region: 'Greater Accra',
    speciality: 'Culture & Art',
    rating: 4.8,
    reviews: 198,
    languages: ['English', 'Twi', 'Ga'],
    available: true,
    tours: 95,
    experience: '5 years',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80',
    bio: 'Cultural historian and certified guide covering Accra\'s arts scene, museums and historical landmarks.',
    sites: ['Kwame Nkrumah Memorial', 'National Museum', 'Labadi Beach'],
    price: 'GHS 120/hr',
  },
  {
    id: 'g3',
    name: 'Kofi Boateng',
    region: 'Savannah Region',
    speciality: 'Wildlife & Nature',
    rating: 4.7,
    reviews: 245,
    languages: ['English', 'Dagbani'],
    available: false,
    tours: 203,
    experience: '10 years',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
    bio: 'Wildlife specialist with deep knowledge of Mole National Park and northern Ghana ecosystems.',
    sites: ['Mole National Park', 'Larabanga Mosque', 'Paga Crocodile Pond'],
    price: 'GHS 180/hr',
  },
  {
    id: 'g4',
    name: 'Ama Owusu',
    region: 'Ashanti Region',
    speciality: 'Royal Heritage & Culture',
    rating: 4.9,
    reviews: 421,
    languages: ['English', 'Twi'],
    available: true,
    tours: 310,
    experience: '12 years',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&q=80',
    bio: 'Expert in Ashanti royal heritage, kente weaving traditions and the Manhyia Palace. Born and raised in Kumasi.',
    sites: ['Manhyia Palace', 'Kejetia Market', 'Lake Bosomtwe'],
    price: 'GHS 160/hr',
  },
  {
    id: 'g5',
    name: 'Yaw Darko',
    region: 'Eastern Region',
    speciality: 'Nature & Waterfalls',
    rating: 4.6,
    reviews: 134,
    languages: ['English', 'Twi', 'Krobo'],
    available: true,
    tours: 87,
    experience: '4 years',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
    bio: 'Nature enthusiast and certified eco-guide specialising in the Eastern Region\'s waterfalls and forests.',
    sites: ['Boti Falls', 'Aburi Botanical Gardens', 'Volta Lake'],
    price: 'GHS 100/hr',
  },
  {
    id: 'g6',
    name: 'Akosua Frimpong',
    region: 'Central Region',
    speciality: 'Beaches & Coastal History',
    rating: 4.8,
    reviews: 276,
    languages: ['English', 'Fante', 'Twi'],
    available: false,
    tours: 189,
    experience: '7 years',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    bio: 'Coastal heritage specialist covering Cape Coast, Elmina and the beautiful beaches of the Central Region.',
    sites: ['Cape Coast Castle', 'Kakum National Park', 'Brenu Beach'],
    price: 'GHS 140/hr',
  },
];

const SPECIALITIES = [
  'All',
  'History',
  'Wildlife',
  'Culture',
  'Nature',
  'Beaches',
];

const SORT_OPTIONS = ['Top Rated', 'Most Tours', 'Price: Low', 'Price: High'];

// ─── GUIDE CARD COMPONENT ─────────────────────────────────────────────────────

function GuideCard({ guide, onPress, onCall, onMessage }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(guide)}
      activeOpacity={0.88}
    >
      {/* Avatar + online dot */}
      <View style={styles.cardLeft}>
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: guide.avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View
            style={[
              styles.onlineDot,
              { backgroundColor: guide.available ? C.online : C.offline },
            ]}
          />
        </View>
        <Text style={styles.availText}>
          {guide.available ? 'Online' : 'Offline'}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <View style={styles.cardTop}>
          <Text style={styles.guideName} numberOfLines={1}>{guide.name}</Text>
          <Text style={styles.guidePrice}>{guide.price}</Text>
        </View>

        <Text style={styles.guideSpeciality}>{guide.speciality}</Text>
        <Text style={styles.guideRegion}>{guide.region}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>★ {guide.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{guide.tours}</Text>
            <Text style={styles.statLabel}>Tours</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{guide.experience}</Text>
            <Text style={styles.statLabel}>Exp.</Text>
          </View>
        </View>

        {/* Languages */}
        <View style={styles.langRow}>
          {guide.languages.map((lang) => (
            <View key={lang} style={styles.langBadge}>
              <Text style={styles.langText}>{lang}</Text>
            </View>
          ))}
        </View>

        {/* Action buttons */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[
              styles.callBtn,
              !guide.available && styles.btnDisabled,
            ]}
            onPress={() => guide.available && onCall(guide)}
            disabled={!guide.available}
          >
            <Text style={styles.callBtnText}>Video Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.msgBtn}
            onPress={() => onMessage(guide)}
          >
            <Text style={styles.msgBtnText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function GuideListScreen({ navigation }) {
  const [searchText, setSearchText]           = useState('');
  const [selectedSpec, setSelectedSpec]       = useState('All');
  const [selectedSort, setSelectedSort]       = useState('Top Rated');
  const [showOnlineOnly, setShowOnlineOnly]   = useState(false);
  const [showFilters, setShowFilters]         = useState(false);

  // ── Filter + sort logic ──
  let results = ALL_GUIDES;

  if (searchText.trim()) {
    results = results.filter(
      (g) =>
        g.name.toLowerCase().includes(searchText.toLowerCase()) ||
        g.region.toLowerCase().includes(searchText.toLowerCase()) ||
        g.speciality.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  if (selectedSpec !== 'All') {
    results = results.filter((g) =>
      g.speciality.toLowerCase().includes(selectedSpec.toLowerCase())
    );
  }

  if (showOnlineOnly) {
    results = results.filter((g) => g.available);
  }

  if (selectedSort === 'Top Rated') {
    results = [...results].sort((a, b) => b.rating - a.rating);
  } else if (selectedSort === 'Most Tours') {
    results = [...results].sort((a, b) => b.tours - a.tours);
  } else if (selectedSort === 'Price: Low') {
    results = [...results].sort(
      (a, b) =>
        parseInt(a.price.replace('GHS ', '').replace('/hr', '')) -
        parseInt(b.price.replace('GHS ', '').replace('/hr', ''))
    );
  } else if (selectedSort === 'Price: High') {
    results = [...results].sort(
      (a, b) =>
        parseInt(b.price.replace('GHS ', '').replace('/hr', '')) -
        parseInt(a.price.replace('GHS ', '').replace('/hr', ''))
    );
  }

  const handleGuidePress  = (guide) => console.log('View guide:', guide.name);
  const handleCall        = (guide) => console.log('Call guide:', guide.name);
  const handleMessage     = (guide) => console.log('Message guide:', guide.name);

  const onlineCount = ALL_GUIDES.filter((g) => g.available).length;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Tour Guides</Text>
          <Text style={styles.headerSub}>
            {onlineCount} guides online now
          </Text>
        </View>
        <View style={styles.onlinePill}>
          <View style={styles.onlinePillDot} />
          <Text style={styles.onlinePillText}>{onlineCount} Live</Text>
        </View>
      </View>

      {/* ── SEARCH BAR ── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search guides, regions, specialities..."
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
          <Text
            style={[
              styles.filterBtnText,
              showFilters && styles.filterBtnTextActive,
            ]}
          >
            Filter
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── SPECIALITY PILLS ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {SPECIALITIES.map((spec) => (
          <TouchableOpacity
            key={spec}
            onPress={() => setSelectedSpec(spec)}
            style={[
              styles.pill,
              selectedSpec === spec && styles.pillActive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                selectedSpec === spec && styles.pillTextActive,
              ]}
            >
              {spec}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── FILTER PANEL ── */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>Sort By</Text>
          <View style={styles.filterRow}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setSelectedSort(option)}
                style={[
                  styles.filterChip,
                  selectedSort === option && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedSort === option && styles.filterChipTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Show online guides only</Text>
            <TouchableOpacity
              style={[
                styles.toggle,
                showOnlineOnly && styles.toggleActive,
              ]}
              onPress={() => setShowOnlineOnly(!showOnlineOnly)}
            >
              <View
                style={[
                  styles.toggleThumb,
                  showOnlineOnly && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── RESULTS COUNT ── */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {results.length} guide{results.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* ── GUIDE LIST ── */}
      {results.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No guides found</Text>
          <Text style={styles.emptySub}>Try a different search or filter</Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setSearchText('');
              setSelectedSpec('All');
              setShowOnlineOnly(false);
            }}
          >
            <Text style={styles.resetBtnText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <GuideCard
              guide={item}
              onPress={handleGuidePress}
              onCall={handleCall}
              onMessage={handleMessage}
            />
          )}
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
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  onlinePillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.online,
  },
  onlinePillText: {
    fontSize: 12,
    color: C.online,
    fontWeight: '700',
  },

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
  searchInput: { flex: 1, fontSize: 14, color: C.textPrimary },
  clearText:   { fontSize: 14, color: C.textMuted, paddingHorizontal: 4 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 28,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterBtnActive:    { backgroundColor: C.primary, borderColor: C.primary },
  filterBtnText:      { fontSize: 13, color: C.textSecondary, fontWeight: '600' },
  filterBtnTextActive:{ color: C.white },

  // Pills
  pillsRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  pillActive:     { backgroundColor: C.primary, borderColor: C.primary },
  pillText:       { fontSize: 14, color: C.textSecondary, fontWeight: '600' },
  pillTextActive: { color: C.white, fontWeight: '700' },

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
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
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

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: { fontSize: 13, color: C.textPrimary, fontWeight: '500' },
  toggle: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.border,
    justifyContent: 'center',
    padding: 3,
  },
  toggleActive: { backgroundColor: C.primary },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.white,
  },
  toggleThumbActive: { alignSelf: 'flex-end' },

  // Results count
  resultsRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: { fontSize: 12, color: C.textMuted },

  // List
  listContainer: { paddingHorizontal: 16, paddingBottom: 100 },

  // Guide card
  card: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: C.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  // Avatar
  cardLeft: { alignItems: 'center', marginRight: 14 },
  avatarWrap: { position: 'relative', marginBottom: 6 },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: C.border,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: C.white,
  },
  availText: { fontSize: 10, color: C.textMuted, fontWeight: '500' },

  // Card info
  cardInfo: { flex: 1 },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  guideName:      { fontSize: 15, fontWeight: '800', color: C.textPrimary, flex: 1 },
  guidePrice:     { fontSize: 12, color: C.primary, fontWeight: '700' },
  guideSpeciality:{ fontSize: 12, color: C.primary, fontWeight: '600', marginBottom: 2 },
  guideRegion:    { fontSize: 11, color: C.textMuted, marginBottom: 10 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bg,
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  statItem:    { flex: 1, alignItems: 'center' },
  statDivider: { width: 0.5, height: 24, backgroundColor: C.border },
  statValue:   { fontSize: 13, fontWeight: '700', color: C.textPrimary },
  statLabel:   { fontSize: 10, color: C.textMuted, marginTop: 2 },

  // Languages
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  langBadge: {
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  langText: { fontSize: 10, color: C.primary, fontWeight: '600' },

  // Action buttons
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  callBtn: {
    flex: 1,
    backgroundColor: C.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: C.textMuted },
  callBtnText: { fontSize: 13, color: C.white, fontWeight: '700' },
  msgBtn: {
    flex: 1,
    backgroundColor: C.card,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.primary,
  },
  msgBtnText: { fontSize: 13, color: C.primary, fontWeight: '700' },

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