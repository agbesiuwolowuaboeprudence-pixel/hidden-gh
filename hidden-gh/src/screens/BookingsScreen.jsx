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
  success:       '#2E7D52',
  warning:       '#E65100',
  info:          '#1565C0',
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const BOOKINGS = [
  {
    id: 'b1',
    type: 'guide',
    guide: 'Kwame Asante',
    site: 'Cape Coast Castle',
    date: 'June 20, 2026',
    time: '9:00 AM',
    duration: '3 hours',
    amount: 'GHS 450',
    status: 'Completed',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    siteImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    bookingRef: 'HG-2026-001',
  },
  {
    id: 'b2',
    type: 'guide',
    guide: 'Abena Mensah',
    site: 'Kwame Nkrumah Memorial',
    date: 'June 28, 2026',
    time: '10:00 AM',
    duration: '2 hours',
    amount: 'GHS 240',
    status: 'Upcoming',
    rating: null,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    siteImage: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=600&q=80',
    bookingRef: 'HG-2026-002',
  },
  {
    id: 'b3',
    type: 'hotel',
    hotel: 'Elmina Beach Resort',
    site: 'Elmina, Central Region',
    date: 'July 5, 2026',
    time: 'Check-in 2:00 PM',
    duration: '2 nights',
    amount: 'GHS 640',
    status: 'Upcoming',
    rating: null,
    avatar: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=200&q=80',
    siteImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80',
    bookingRef: 'HG-2026-003',
  },
  {
    id: 'b4',
    type: 'guide',
    guide: 'Kofi Boateng',
    site: 'Mole National Park',
    date: 'May 15, 2026',
    time: '6:00 AM',
    duration: '5 hours',
    amount: 'GHS 900',
    status: 'Cancelled',
    rating: null,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    siteImage: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=600&q=80',
    bookingRef: 'HG-2026-004',
  },
  {
    id: 'b5',
    type: 'guide',
    guide: 'Ama Owusu',
    site: 'Manhyia Palace',
    date: 'April 10, 2026',
    time: '11:00 AM',
    duration: '2 hours',
    amount: 'GHS 320',
    status: 'Completed',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&q=80',
    siteImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    bookingRef: 'HG-2026-005',
  },
];

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const SUMMARY = [
  { label: 'Total Spent',  value: 'GHS 2,550', icon: '💰' },
  { label: 'Tours Taken',  value: '3',          icon: '🗺' },
  { label: 'Sites Visited',value: '4',          icon: '📍' },
  { label: 'Guides Met',   value: '4',          icon: '👥' },
];

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  Completed: {
    bg:    '#E8F5EE',
    color: '#1B5E3B',
    dot:   '#2E7D52',
  },
  Upcoming: {
    bg:    '#FFF8E1',
    color: '#E65100',
    dot:   '#F5A623',
  },
  Cancelled: {
    bg:    '#FFEBEE',
    color: '#C62828',
    dot:   '#E53935',
  },
};

// ─── BOOKING CARD ─────────────────────────────────────────────────────────────

function BookingCard({ booking, onPress, onCancel, onReview }) {
  const status = STATUS_CONFIG[booking.status];
  const isGuide = booking.type === 'guide';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(booking)}
      activeOpacity={0.92}
    >
      {/* Site image banner */}
      <View style={styles.cardBanner}>
        <Image
          source={{ uri: booking.siteImage }}
          style={styles.cardBannerImage}
          resizeMode="cover"
        />
        <View style={styles.cardBannerOverlay} />

        {/* Status badge */}
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
          <Text style={[styles.statusText, { color: status.color }]}>
            {booking.status}
          </Text>
        </View>

        {/* Booking type badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {isGuide ? 'Guide Tour' : 'Hotel Stay'}
          </Text>
        </View>

        {/* Ref number */}
        <Text style={styles.refText}>{booking.bookingRef}</Text>
      </View>

      {/* Card body */}
      <View style={styles.cardBody}>

        {/* Guide/Hotel info */}
        <View style={styles.cardTop}>
          <Image
            source={{ uri: booking.avatar }}
            style={styles.cardAvatar}
            resizeMode="cover"
          />
          <View style={styles.cardTopInfo}>
            <Text style={styles.cardName}>
              {isGuide ? booking.guide : booking.hotel}
            </Text>
            <Text style={styles.cardSite} numberOfLines={1}>
              {booking.site}
            </Text>
          </View>
          <View style={styles.cardAmount}>
            <Text style={styles.cardAmountText}>{booking.amount}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Details row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📅</Text>
            <View>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{booking.date}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🕐</Text>
            <View>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{booking.time}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>⏱</Text>
            <View>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{booking.duration}</Text>
            </View>
          </View>
        </View>

        {/* Rating row if completed */}
        {booking.status === 'Completed' && (
          <View style={styles.ratingRow}>
            {booking.rating ? (
              <View style={styles.ratingDisplay}>
                <Text style={styles.ratingLabel}>Your rating: </Text>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text
                    key={star}
                    style={[
                      styles.ratingStar,
                      { color: star <= booking.rating ? C.accent : C.border },
                    ]}
                  >
                    ★
                  </Text>
                ))}
              </View>
            ) : (
              <TouchableOpacity
                style={styles.reviewBtn}
                onPress={() => onReview(booking)}
              >
                <Text style={styles.reviewBtnText}>Leave a Review</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.rebookBtn}>
              <Text style={styles.rebookBtnText}>Rebook</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Upcoming actions */}
        {booking.status === 'Upcoming' && (
          <View style={styles.upcomingActions}>
            <TouchableOpacity style={styles.viewDetailsBtn}>
              <Text style={styles.viewDetailsBtnText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => onCancel(booking)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cancelled note */}
        {booking.status === 'Cancelled' && (
          <View style={styles.cancelledNote}>
            <Text style={styles.cancelledNoteText}>
              This booking was cancelled. Tap to rebook.
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function BookingsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('All');

  const filtered =
    activeTab === 'All'
      ? BOOKINGS
      : BOOKINGS.filter((b) => b.status === activeTab);

  const handlePress  = (booking) => console.log('View booking:', booking.bookingRef);
  const handleCancel = (booking) => console.log('Cancel:', booking.bookingRef);
  const handleReview = (booking) => console.log('Review:', booking.bookingRef);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Bookings</Text>
            <Text style={styles.headerSub}>
              {BOOKINGS.length} bookings total
            </Text>
          </View>
          <TouchableOpacity style={styles.newBookingBtn}>
            <Text style={styles.newBookingBtnText}>+ New</Text>
          </TouchableOpacity>
        </View>

        {/* ── SUMMARY CARDS ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryRow}
        >
          {SUMMARY.map((item) => (
            <View key={item.label} style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>{item.icon}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
              <Text style={styles.summaryLabel}>{item.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── TABS ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
              <View style={[
                styles.tabCount,
                activeTab === tab && styles.tabCountActive,
              ]}>
                <Text style={[
                  styles.tabCountText,
                  activeTab === tab && styles.tabCountTextActive,
                ]}>
                  {tab === 'All'
                    ? BOOKINGS.length
                    : BOOKINGS.filter((b) => b.status === tab).length}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── BOOKINGS LIST ── */}
        <View style={styles.listContainer}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🗓</Text>
              <Text style={styles.emptyTitle}>No bookings here</Text>
              <Text style={styles.emptySub}>
                Start exploring and book a guide or hotel
              </Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigation.navigate('Explore')}
              >
                <Text style={styles.exploreBtnText}>Explore Sites</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filtered.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onPress={handlePress}
                onCancel={handleCancel}
                onReview={handleReview}
              />
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.textPrimary },
  headerSub:   { fontSize: 12, color: C.textMuted, marginTop: 2 },
  newBookingBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newBookingBtnText: { fontSize: 13, color: C.white, fontWeight: '700' },

  // Summary
  summaryRow: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  summaryCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: 110,
    borderWidth: 0.5,
    borderColor: C.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  summaryIcon:  { fontSize: 24, marginBottom: 8 },
  summaryValue: { fontSize: 16, fontWeight: '800', color: C.primary, marginBottom: 4 },
  summaryLabel: { fontSize: 11, color: C.textMuted, textAlign: 'center' },

  // Tabs
  tabsRow: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    gap: 6,
  },
  tabActive:     { backgroundColor: C.primary, borderColor: C.primary },
  tabText:       { fontSize: 13, color: C.textSecondary, fontWeight: '600' },
  tabTextActive: { color: C.white },
  tabCount: {
    backgroundColor: C.bg,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  tabCountActive:     { backgroundColor: 'rgba(255,255,255,0.25)' },
  tabCountText:       { fontSize: 11, color: C.textMuted, fontWeight: '700' },
  tabCountTextActive: { color: C.white },

  // List
  listContainer: { paddingHorizontal: 16 },

  // Booking card
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: C.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  // Card banner
  cardBanner: {
    height: 120,
    position: 'relative',
  },
  cardBannerImage: {
    width: '100%',
    height: '100%',
  },
  cardBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  statusDot:  { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  typeBadgeText: { fontSize: 11, color: C.white, fontWeight: '600' },
  refText: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },

  // Card body
  cardBody: { padding: 14 },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  cardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: C.border,
  },
  cardTopInfo: { flex: 1 },
  cardName:    { fontSize: 15, fontWeight: '800', color: C.textPrimary, marginBottom: 3 },
  cardSite:    { fontSize: 12, color: C.textSecondary },
  cardAmount: {
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  cardAmountText: { fontSize: 13, fontWeight: '800', color: C.primary },

  // Divider
  cardDivider: {
    height: 0.5,
    backgroundColor: C.border,
    marginBottom: 14,
  },

  // Details
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  detailIcon:  { fontSize: 16 },
  detailLabel: { fontSize: 10, color: C.textMuted, marginBottom: 2 },
  detailValue: { fontSize: 12, fontWeight: '700', color: C.textPrimary },

  // Rating row
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: C.border,
  },
  ratingDisplay: { flexDirection: 'row', alignItems: 'center' },
  ratingLabel:   { fontSize: 12, color: C.textMuted },
  ratingStar:    { fontSize: 16 },
  reviewBtn: {
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  reviewBtnText: { fontSize: 12, color: C.primary, fontWeight: '700' },
  rebookBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  rebookBtnText: { fontSize: 12, color: C.white, fontWeight: '700' },

  // Upcoming actions
  upcomingActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: C.border,
  },
  viewDetailsBtn: {
    flex: 1,
    backgroundColor: C.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewDetailsBtnText: { fontSize: 13, color: C.white, fontWeight: '700' },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 13, color: '#C62828', fontWeight: '700' },

  // Cancelled note
  cancelledNote: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  cancelledNoteText: { fontSize: 12, color: '#C62828', textAlign: 'center' },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyIcon:  { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
  emptySub:   { fontSize: 13, color: C.textMuted, textAlign: 'center' },
  exploreBtn: {
    marginTop: 8,
    backgroundColor: C.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  exploreBtnText: { fontSize: 13, color: C.white, fontWeight: '600' },
});