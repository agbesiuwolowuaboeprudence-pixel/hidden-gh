import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
} from 'react-native';

const { width, height } = Dimensions.get('window');

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

// ─── MOCK DETAIL DATA ─────────────────────────────────────────────────────────

const SITE_DETAILS = {
  '1': {
    id: '1',
    name: 'Cape Coast Castle',
    location: 'Cape Coast, Central Region',
    category: 'Historical',
    rating: 4.8,
    reviews: 2341,
    entryFee: 'GHS 80',
    openingHours: '9:00 AM - 5:00 PM',
    isPremium: false,
    phone: '+233 33 213 3051',
    website: 'www.ghanamuseums.org',
    description:
      'Cape Coast Castle is one of about forty slave castles built on the Gold Coast of West Africa by European traders. It is the largest of these castles and was originally built by the Swedes for trade in timber and gold before being taken over for the slave trade by the Danes, Dutch, and later the British.',
    premiumContent:
      'The castle dungeons once held thousands of enslaved Africans before their forced journey across the Atlantic. The Door of No Return stands as a symbol of this brutal history. Archaeological excavations have revealed layers of human remains beneath the castle floors, telling a story that official records never captured. Premium members gain access to exclusive documentary footage filmed inside the restricted sections of the castle.',
    highlights: [
      'UNESCO World Heritage Site',
      'Door of No Return',
      'Underground dungeons',
      'Museum & exhibitions',
      'Guided tours available',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1589825743636-4b8e933a0b4e?w=800&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80',
      'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80',
    ],
    nearbyGuides: [
      {
        id: 'g1',
        name: 'Kwame Asante',
        speciality: 'History & Slave Trade',
        rating: 4.9,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
        available: true,
      },
      {
        id: 'g2',
        name: 'Abena Mensah',
        speciality: 'Culture & Art',
        rating: 4.8,
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
        available: false,
      },
    ],
    coordinates: { latitude: 5.1047, longitude: -1.2427 },
  },
};

// ─── DEFAULT SITE (used when no route param passed) ───────────────────────────

const DEFAULT_SITE = SITE_DETAILS['1'];

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function SiteDetailScreen({ route, navigation }) {
  const site = route?.params?.site
    ? { ...DEFAULT_SITE, ...route.params.site }
    : DEFAULT_SITE;

  const [liked, setLiked]               = useState(false);
  const [activeTab, setActiveTab]       = useState('Overview');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPremiumUser]                 = useState(false);

  const TABS = ['Overview', 'Gallery', 'Guides', 'Reviews'];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HERO IMAGE ── */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: site.gallery?.[selectedImage] || site.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />

          {/* Back + Actions */}
          <View style={styles.heroTop}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation?.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setLiked(!liked)}
              >
                <Text style={styles.actionIcon}>{liked ? '❤️' : '♡'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>⬆</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero info overlay */}
          <View style={styles.heroBottom}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{site.category}</Text>
            </View>
            <Text style={styles.heroName}>{site.name}</Text>
            <View style={styles.heroMeta}>
              <Text style={styles.heroLocation}>📍 {site.location}</Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ {site.rating}</Text>
                <Text style={styles.reviewCount}>({site.reviews?.toLocaleString()})</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── QUICK INFO ROW ── */}
        <View style={styles.quickInfo}>
          <View style={styles.quickInfoItem}>
            <Text style={styles.quickInfoIcon}>🕐</Text>
            <Text style={styles.quickInfoLabel}>Hours</Text>
            <Text style={styles.quickInfoValue}>{site.openingHours}</Text>
          </View>
          <View style={styles.quickInfoDivider} />
          <View style={styles.quickInfoItem}>
            <Text style={styles.quickInfoIcon}>🎟</Text>
            <Text style={styles.quickInfoLabel}>Entry Fee</Text>
            <Text style={styles.quickInfoValue}>{site.entryFee}</Text>
          </View>
          <View style={styles.quickInfoDivider} />
          <View style={styles.quickInfoItem}>
            <Text style={styles.quickInfoIcon}>📞</Text>
            <Text style={styles.quickInfoLabel}>Contact</Text>
            <Text style={styles.quickInfoValue} numberOfLines={1}>Call Us</Text>
          </View>
        </View>

        {/* ── ACTION BUTTONS ── */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>📍 Get Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>🎥 Talk to Guide</Text>
          </TouchableOpacity>
        </View>

        {/* ── TABS ── */}
        <View style={styles.tabsRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── TAB CONTENT ── */}
        <View style={styles.tabContent}>

          {/* OVERVIEW TAB */}
          {activeTab === 'Overview' && (
            <View>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{site.description}</Text>

              {/* Highlights */}
              <Text style={styles.sectionTitle}>Highlights</Text>
              <View style={styles.highlightsList}>
                {site.highlights?.map((item, index) => (
                  <View key={index} style={styles.highlightItem}>
                    <View style={styles.highlightDot} />
                    <Text style={styles.highlightText}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Premium content lock */}
              {!isPremiumUser ? (
                <View style={styles.premiumLock}>
                  <Text style={styles.premiumLockIcon}>👑</Text>
                  <Text style={styles.premiumLockTitle}>
                    Unlock Full Historical Content
                  </Text>
                  <Text style={styles.premiumLockDesc}>
                    Get access to in-depth history, expert insights, audio
                    narrations and exclusive documentaries about this site.
                  </Text>
                  <TouchableOpacity style={styles.premiumLockBtn}>
                    <Text style={styles.premiumLockBtnText}>Go Premium</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.premiumContent}>
                  <View style={styles.premiumContentHeader}>
                    <Text style={styles.premiumContentIcon}>👑</Text>
                    <Text style={styles.premiumContentLabel}>Premium Content</Text>
                  </View>
                  <Text style={styles.premiumContentText}>{site.premiumContent}</Text>
                </View>
              )}
            </View>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'Gallery' && (
            <View>
              <Text style={styles.sectionTitle}>Photo Gallery</Text>
              <View style={styles.galleryGrid}>
                {site.gallery?.map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedImage(index)}
                    style={[
                      styles.galleryThumb,
                      selectedImage === index && styles.galleryThumbActive,
                    ]}
                  >
                    <Image
                      source={{ uri: img }}
                      style={styles.galleryThumbImage}
                      resizeMode="cover"
                    />
                    {selectedImage === index && (
                      <View style={styles.galleryThumbOverlay} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.galleryHint}>
                Tap a photo to preview it in the hero above
              </Text>
            </View>
          )}

          {/* GUIDES TAB */}
          {activeTab === 'Guides' && (
            <View>
              <Text style={styles.sectionTitle}>Available Guides</Text>
              {site.nearbyGuides?.map((guide) => (
                <View key={guide.id} style={styles.guideCard}>
                  <Image
                    source={{ uri: guide.avatar }}
                    style={styles.guideAvatar}
                  />
                  <View style={styles.guideInfo}>
                    <Text style={styles.guideName}>{guide.name}</Text>
                    <Text style={styles.guideSpeciality}>{guide.speciality}</Text>
                    <Text style={styles.guideRating}>⭐ {guide.rating}</Text>
                  </View>
                  <View style={styles.guideActions}>
                    <View style={[
                      styles.availabilityDot,
                      { backgroundColor: guide.available ? '#2E7D52' : C.textMuted },
                    ]} />
                    <Text style={styles.availabilityText}>
                      {guide.available ? 'Online' : 'Offline'}
                    </Text>
                    {guide.available && (
                      <TouchableOpacity style={styles.callGuideBtn}>
                        <Text style={styles.callGuideBtnText}>Call</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'Reviews' && (
            <View>
              <Text style={styles.sectionTitle}>Visitor Reviews</Text>

              {/* Rating summary */}
              <View style={styles.ratingSummary}>
                <Text style={styles.ratingBig}>{site.rating}</Text>
                <View>
                  <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐</Text>
                  <Text style={styles.ratingTotal}>
                    {site.reviews?.toLocaleString()} reviews
                  </Text>
                </View>
              </View>

              {/* Mock reviews */}
              {[
                {
                  name: 'Kofi A.',
                  rating: 5,
                  date: 'June 2026',
                  text: 'An incredibly moving experience. Every Ghanaian and African should visit this place.',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                },
                {
                  name: 'Sarah M.',
                  rating: 5,
                  date: 'May 2026',
                  text: 'The guided tour was exceptional. Our guide brought history to life in a way I will never forget.',
                  avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
                },
                {
                  name: 'James O.',
                  rating: 4,
                  date: 'April 2026',
                  text: 'Very well maintained. The museum inside is comprehensive and informative.',
                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
                },
              ].map((review, index) => (
                <View key={index} style={styles.reviewCard}>
                  <View style={styles.reviewTop}>
                    <Image
                      source={{ uri: review.avatar }}
                      style={styles.reviewAvatar}
                    />
                    <View style={styles.reviewMeta}>
                      <Text style={styles.reviewName}>{review.name}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                    <Text style={styles.reviewRating}>
                      {'⭐'.repeat(review.rating)}
                    </Text>
                  </View>
                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
              ))}
            </View>
          )}

        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── BOTTOM BOOK BAR ── */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomBarLabel}>Entry Fee</Text>
          <Text style={styles.bottomBarPrice}>{site.entryFee}</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn}>
          <Text style={styles.bookBtnText}>Book a Guide</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Hero
  heroContainer: { width: '100%', height: 320, position: 'relative' },
  heroImage:     { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay:   {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 54,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon:    { fontSize: 20, color: C.white },
  heroActions: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: { fontSize: 18 },

  heroBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  categoryBadge: {
    backgroundColor: C.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryBadgeText: { fontSize: 11, color: C.white, fontWeight: '700' },
  heroName: {
    fontSize: 24,
    fontWeight: '800',
    color: C.white,
    marginBottom: 8,
    lineHeight: 30,
  },
  heroMeta:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroLocation: { fontSize: 12, color: 'rgba(255,255,255,0.85)', flex: 1 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText:  { fontSize: 12, color: C.white, fontWeight: '700' },
  reviewCount: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },

  // Quick info
  quickInfo: {
    flexDirection: 'row',
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 14,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  quickInfoItem:    { flex: 1, alignItems: 'center', gap: 4 },
  quickInfoDivider: { width: 0.5, backgroundColor: C.border, marginHorizontal: 8 },
  quickInfoIcon:    { fontSize: 20 },
  quickInfoLabel:   { fontSize: 10, color: C.textMuted, textTransform: 'uppercase' },
  quickInfoValue:   { fontSize: 11, color: C.textPrimary, fontWeight: '700', textAlign: 'center' },

  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: C.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText:  { fontSize: 13, color: C.white, fontWeight: '700' },
  secondaryBtn: {
    flex: 1,
    backgroundColor: C.card,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: C.border,
  },
  secondaryBtnText: { fontSize: 13, color: C.primary, fontWeight: '700' },

  // Tabs
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 4,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive:    { backgroundColor: C.primary },
  tabText:      { fontSize: 12, color: C.textSecondary, fontWeight: '600' },
  tabTextActive:{ color: C.white },

  // Tab content
  tabContent: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: C.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },

  // Highlights
  highlightsList: { marginBottom: 20, gap: 8 },
  highlightItem:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  highlightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
  },
  highlightText: { fontSize: 14, color: C.textSecondary },

  // Premium lock
  premiumLock: {
    backgroundColor: '#0F3D22',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  premiumLockIcon:    { fontSize: 32, marginBottom: 10 },
  premiumLockTitle:   { fontSize: 16, fontWeight: '800', color: C.white, marginBottom: 8, textAlign: 'center' },
  premiumLockDesc:    { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  premiumLockBtn: {
    backgroundColor: C.accent,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  premiumLockBtnText: { fontSize: 13, fontWeight: '700', color: C.black },

  // Premium content (unlocked)
  premiumContent: {
    backgroundColor: '#F0F7F4',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
    marginBottom: 20,
  },
  premiumContentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  premiumContentIcon:   { fontSize: 16 },
  premiumContentLabel:  { fontSize: 12, color: C.primary, fontWeight: '700' },
  premiumContentText:   { fontSize: 13, color: C.textSecondary, lineHeight: 20 },

  // Gallery
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  galleryThumb: {
    width: (width - 56) / 3,
    height: (width - 56) / 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  galleryThumbActive:   { borderWidth: 2, borderColor: C.primary },
  galleryThumbImage:    { width: '100%', height: '100%' },
  galleryThumbOverlay:  {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27,94,59,0.3)',
  },
  galleryHint: { fontSize: 11, color: C.textMuted, textAlign: 'center', marginTop: 4 },

  // Guides
  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  guideAvatar:    { width: 52, height: 52, borderRadius: 26, marginRight: 12 },
  guideInfo:      { flex: 1 },
  guideName:      { fontSize: 14, fontWeight: '700', color: C.textPrimary },
  guideSpeciality:{ fontSize: 12, color: C.textSecondary, marginVertical: 2 },
  guideRating:    { fontSize: 12, color: C.textMuted },
  guideActions:   { alignItems: 'center', gap: 4 },
  availabilityDot:{ width: 8, height: 8, borderRadius: 4 },
  availabilityText:{ fontSize: 10, color: C.textMuted },
  callGuideBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 4,
  },
  callGuideBtnText: { fontSize: 11, color: C.white, fontWeight: '700' },

  // Reviews
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  ratingBig:   { fontSize: 48, fontWeight: '800', color: C.primary },
  ratingStars: { fontSize: 20 },
  ratingTotal: { fontSize: 12, color: C.textMuted, marginTop: 4 },
  reviewCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  reviewTop:    { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  reviewAvatar: { width: 38, height: 38, borderRadius: 19, marginRight: 10 },
  reviewMeta:   { flex: 1 },
  reviewName:   { fontSize: 13, fontWeight: '700', color: C.textPrimary },
  reviewDate:   { fontSize: 11, color: C.textMuted },
  reviewRating: { fontSize: 12 },
  reviewText:   { fontSize: 13, color: C.textSecondary, lineHeight: 20 },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.card,
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 28,
    borderTopWidth: 0.5,
    borderTopColor: C.border,
    elevation: 10,
  },
  bottomBarLabel: { fontSize: 11, color: C.textMuted },
  bottomBarPrice: { fontSize: 18, fontWeight: '800', color: C.primary },
  bookBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 14,
  },
  bookBtnText: { fontSize: 14, color: C.white, fontWeight: '700' },
});