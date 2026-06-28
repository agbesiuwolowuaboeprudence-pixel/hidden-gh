import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Switch,
} from 'react-native';

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
  danger:        '#E53935',
};

// ─── MOCK USER DATA ───────────────────────────────────────────────────────────

const USER = {
  name: 'Prudence Agbesiuwolowuaboe',
  email: 'prudence@email.com',
  phone: '+233 24 000 0000',
  location: 'Kumasi, Ashanti Region',
  memberSince: 'January 2025',
  isPremium: false,
  avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80',
  stats: {
    sitesVisited: 12,
    savedSites:   8,
    toursBooked:  3,
    reviews:      5,
  },
};

const SAVED_SITES = [
  {
    id: '1',
    name: 'Cape Coast Castle',
    location: 'Cape Coast',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=80',
  },
  {
    id: '2',
    name: 'Mole National Park',
    location: 'Savannah Region',
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=300&q=80',
  },
  {
    id: '3',
    name: 'Labadi Beach',
    location: 'Accra',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80',
  },
];

const RECENT_BOOKINGS = [
  {
    id: 'b1',
    guide: 'Kwame Asante',
    site: 'Cape Coast Castle',
    date: 'June 20, 2026',
    status: 'Completed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    id: 'b2',
    guide: 'Abena Mensah',
    site: 'Kwame Nkrumah Memorial',
    date: 'June 25, 2026',
    status: 'Upcoming',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
  },
];

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────

function StatCard({ value, label }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function MenuRow({ icon, label, value, onPress, danger, showArrow }) {
  return (
    <TouchableOpacity
      style={styles.menuRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Text style={styles.menuIconText}>{icon}</Text>
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
        {label}
      </Text>
      <View style={styles.menuRight}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        {showArrow && <Text style={styles.menuArrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function ProfileScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled]           = useState(false);
  const [activeTab, setActiveTab]                       = useState('Saved');

  const TABS = ['Saved', 'Bookings', 'Reviews'];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── PROFILE CARD ── */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: USER.avatar }}
                style={styles.avatar}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.avatarEdit}>
                <Text style={styles.avatarEditIcon}>✎</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{USER.name}</Text>
              <Text style={styles.profileEmail}>{USER.email}</Text>
              <Text style={styles.profileLocation}>{USER.location}</Text>
              <Text style={styles.profileMember}>
                Member since {USER.memberSince}
              </Text>
            </View>
          </View>

          {/* Premium badge or upgrade prompt */}
          {USER.isPremium ? (
            <View style={styles.premiumActive}>
              <Text style={styles.premiumActiveIcon}>👑</Text>
              <Text style={styles.premiumActiveText}>Premium Member</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.premiumPrompt}>
              <Text style={styles.premiumPromptIcon}>👑</Text>
              <View style={styles.premiumPromptText}>
                <Text style={styles.premiumPromptTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumPromptSub}>
                  Unlock history, 3D tours and VR experiences
                </Text>
              </View>
              <Text style={styles.premiumPromptArrow}>›</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── STATS ROW ── */}
        <View style={styles.statsRow}>
          <StatCard value={USER.stats.sitesVisited} label="Sites Visited" />
          <StatCard value={USER.stats.savedSites}   label="Saved" />
          <StatCard value={USER.stats.toursBooked}  label="Tours" />
          <StatCard value={USER.stats.reviews}      label="Reviews" />
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

        {/* ── SAVED SITES TAB ── */}
        {activeTab === 'Saved' && (
          <View style={styles.tabContent}>
            <SectionHeader
              title="Saved Sites"
              actionLabel="View All"
              onAction={() => {}}
            />
            {SAVED_SITES.map((site) => (
              <TouchableOpacity key={site.id} style={styles.savedCard}>
                <Image
                  source={{ uri: site.image }}
                  style={styles.savedImage}
                  resizeMode="cover"
                />
                <View style={styles.savedInfo}>
                  <Text style={styles.savedName}>{site.name}</Text>
                  <Text style={styles.savedLocation}>{site.location}</Text>
                </View>
                <TouchableOpacity style={styles.savedHeart}>
                  <Text style={styles.savedHeartIcon}>❤️</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── BOOKINGS TAB ── */}
        {activeTab === 'Bookings' && (
          <View style={styles.tabContent}>
            <SectionHeader title="Recent Bookings" />
            {RECENT_BOOKINGS.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <Image
                  source={{ uri: booking.avatar }}
                  style={styles.bookingAvatar}
                  resizeMode="cover"
                />
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingGuide}>{booking.guide}</Text>
                  <Text style={styles.bookingSite}>{booking.site}</Text>
                  <Text style={styles.bookingDate}>{booking.date}</Text>
                </View>
                <View style={[
                  styles.bookingStatus,
                  booking.status === 'Completed'
                    ? styles.statusCompleted
                    : styles.statusUpcoming,
                ]}>
                  <Text style={[
                    styles.bookingStatusText,
                    booking.status === 'Completed'
                      ? styles.statusTextCompleted
                      : styles.statusTextUpcoming,
                  ]}>
                    {booking.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── REVIEWS TAB ── */}
        {activeTab === 'Reviews' && (
          <View style={styles.tabContent}>
            <SectionHeader title="My Reviews" />
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>✍️</Text>
              <Text style={styles.emptyTitle}>No reviews yet</Text>
              <Text style={styles.emptySub}>
                Visit a site and share your experience
              </Text>
              <TouchableOpacity style={styles.emptyBtn}>
                <Text style={styles.emptyBtnText}>Explore Sites</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── SETTINGS ── */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>Settings</Text>

          <View style={styles.menuCard}>
            <MenuRow
              icon="👤"
              label="Edit Profile"
              showArrow
              onPress={() => {}}
            />
            <View style={styles.menuDivider} />
            <MenuRow
              icon="🔒"
              label="Change Password"
              showArrow
              onPress={() => {}}
            />
            <View style={styles.menuDivider} />
            <MenuRow
              icon="📍"
              label="Location"
              value={USER.location}
              showArrow
              onPress={() => {}}
            />
          </View>

          <View style={styles.menuCard}>
            <View style={styles.menuRow}>
              <View style={styles.menuIcon}>
                <Text style={styles.menuIconText}>🔔</Text>
              </View>
              <Text style={styles.menuLabel}>Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: C.border, true: C.primary }}
                thumbColor={C.white}
              />
            </View>
            <View style={styles.menuDivider} />
            <View style={styles.menuRow}>
              <View style={styles.menuIcon}>
                <Text style={styles.menuIconText}>🌙</Text>
              </View>
              <Text style={styles.menuLabel}>Dark Mode</Text>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: C.border, true: C.primary }}
                thumbColor={C.white}
              />
            </View>
          </View>

          <View style={styles.menuCard}>
            <MenuRow
              icon="❓"
              label="Help & Support"
              showArrow
              onPress={() => {}}
            />
            <View style={styles.menuDivider} />
            <MenuRow
              icon="📄"
              label="Terms & Privacy"
              showArrow
              onPress={() => {}}
            />
            <View style={styles.menuDivider} />
            <MenuRow
              icon="⭐"
              label="Rate the App"
              showArrow
              onPress={() => {}}
            />
          </View>

          <View style={styles.menuCard}>
            <MenuRow
              icon="🚪"
              label="Log Out"
              danger
              showArrow
              onPress={() => {}}
            />
          </View>

          <Text style={styles.versionText}>Hidden Ghana v1.0.0</Text>
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
  editBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editBtnText: { fontSize: 13, color: C.white, fontWeight: '600' },

  // Profile card
  profileCard: {
    backgroundColor: C.card,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: C.border,
    marginBottom: 16,
  },
  profileTop: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: C.primary,
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditIcon:  { fontSize: 12, color: C.white },
  profileInfo:     { flex: 1, justifyContent: 'center' },
  profileName:     { fontSize: 16, fontWeight: '800', color: C.textPrimary, marginBottom: 4 },
  profileEmail:    { fontSize: 12, color: C.textSecondary, marginBottom: 2 },
  profileLocation: { fontSize: 12, color: C.textMuted, marginBottom: 2 },
  profileMember:   { fontSize: 11, color: C.textMuted },

  // Premium
  premiumActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F3D22',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  premiumActiveIcon: { fontSize: 18 },
  premiumActiveText: { fontSize: 13, color: C.white, fontWeight: '700' },
  premiumPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F3D22',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  premiumPromptIcon:  { fontSize: 20 },
  premiumPromptText:  { flex: 1 },
  premiumPromptTitle: { fontSize: 13, color: C.white, fontWeight: '700' },
  premiumPromptSub:   { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  premiumPromptArrow: { fontSize: 20, color: C.accent },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: C.border,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: C.primary },
  statLabel: { fontSize: 10, color: C.textMuted, marginTop: 4, textAlign: 'center' },

  // Tabs
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 4,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  tab:          { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive:    { backgroundColor: C.primary },
  tabText:      { fontSize: 13, color: C.textSecondary, fontWeight: '600' },
  tabTextActive:{ color: C.white },

  // Tab content
  tabContent:    { paddingHorizontal: 16, marginBottom: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle:  { fontSize: 15, fontWeight: '700', color: C.textPrimary },
  sectionAction: { fontSize: 13, color: C.primary, fontWeight: '600' },

  // Saved card
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  savedImage:    { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  savedInfo:     { flex: 1 },
  savedName:     { fontSize: 13, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
  savedLocation: { fontSize: 11, color: C.textMuted },
  savedHeart:    { padding: 8 },
  savedHeartIcon:{ fontSize: 18 },

  // Booking card
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  bookingAvatar:  { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  bookingInfo:    { flex: 1 },
  bookingGuide:   { fontSize: 13, fontWeight: '700', color: C.textPrimary, marginBottom: 2 },
  bookingSite:    { fontSize: 12, color: C.textSecondary, marginBottom: 2 },
  bookingDate:    { fontSize: 11, color: C.textMuted },
  bookingStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted:     { backgroundColor: '#E8F5EE' },
  statusUpcoming:      { backgroundColor: '#FFF3E0' },
  bookingStatusText:   { fontSize: 11, fontWeight: '700' },
  statusTextCompleted: { color: C.primary },
  statusTextUpcoming:  { color: '#E65100' },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyIcon:  { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: C.textPrimary },
  emptySub:   { fontSize: 13, color: C.textMuted, textAlign: 'center' },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: C.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyBtnText: { fontSize: 13, color: C.white, fontWeight: '600' },

  // Settings
  settingsSection: { paddingHorizontal: 16 },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDanger:  { backgroundColor: '#FFEBEE' },
  menuIconText:    { fontSize: 18 },
  menuLabel:       { flex: 1, fontSize: 14, color: C.textPrimary, fontWeight: '500' },
  menuLabelDanger: { color: C.danger },
  menuRight:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuValue:       { fontSize: 12, color: C.textMuted },
  menuArrow:       { fontSize: 18, color: C.textMuted },
  menuDivider: {
    height: 0.5,
    backgroundColor: C.border,
    marginLeft: 62,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: C.textMuted,
    marginTop: 8,
    marginBottom: 16,
  },
});