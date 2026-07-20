import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { EmptyState } from '../components/ui/ScreenHeader';
import { RemoteImage } from '../components/ui/RemoteImage';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { bookings, savedSites, userProfile } from '../data/mockData';
import { radius, spacing, typography, useTheme, type Palette } from '../theme';
import type { MainTabScreenProps } from '../types/navigation';
import { useAuthStore } from '@/src/store/authStore';

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

type Props = MainTabScreenProps<'Profile'>;
type Tab = 'Saved' | 'Bookings' | 'Reviews';

type IconName = keyof typeof Ionicons.glyphMap;

export default function ProfileScreen({ navigation }: Props) {
  const { colors, scheme, toggleScheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const user = useAuthStore((s) => s.user);
  const displayName = user?.fullName || userProfile.name;
  const displayEmail = user?.email || userProfile.email;
  const [tab, setTab] = useState<Tab>('Saved');
  const [notifications, setNotifications] = useState(true);

  const stats = [
    { value: userProfile.stats.sitesVisited, label: 'Visited' },
    { value: userProfile.stats.savedSites, label: 'Saved' },
    { value: userProfile.stats.toursBooked, label: 'Tours' },
    { value: userProfile.stats.reviews, label: 'Reviews' },
  ];

  const renderMenuRow = (
    icon: IconName,
    label: string,
    onPress?: () => void,
    opts?: { danger?: boolean; value?: string }
  ) => (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <View style={[styles.menuIcon, opts?.danger && styles.menuIconDanger]}>
        <Ionicons name={icon} size={18} color={opts?.danger ? colors.danger : colors.primary} />
      </View>
      <Text style={[styles.menuLabel, opts?.danger && styles.menuLabelDanger]}>{label}</Text>
      {opts?.value ? <Text style={styles.menuValue}>{opts.value}</Text> : null}
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Pressable style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="create-outline" size={16} color={colors.white} />
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.profileCard}>
          {user ? (
            <View style={[styles.avatar, styles.avatarInitials]}>
              <Text style={styles.avatarInitialsText}>{initials(displayName)}</Text>
            </View>
          ) : (
            <RemoteImage uri={userProfile.avatar} style={styles.avatar} fallbackLabel="You" />
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.email}>{displayEmail}</Text>
            <View style={styles.locRow}>
              <Ionicons name="location-outline" size={13} color={colors.textMuted} />
              <Text style={styles.location}>{userProfile.location}</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.premiumPrompt} onPress={() => navigation.navigate('Premium')}>
          <View style={styles.premiumIcon}>
            <Ionicons name="diamond" size={22} color={colors.accent} />
          </View>
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
            <Text style={styles.premiumSub}>History, 3D tours & VR experiences</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.accent} />
        </Pressable>

        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <SegmentedControl
          options={[
            { value: 'Saved' as const, label: 'Saved' },
            { value: 'Bookings' as const, label: 'Bookings' },
            { value: 'Reviews' as const, label: 'Reviews' },
          ]}
          value={tab}
          onChange={setTab}
        />

        <View style={styles.tabContent}>
          {tab === 'Saved' ? (
            savedSites.map((site) => (
              <Pressable
                key={site.id}
                style={styles.savedCard}
                onPress={() => navigation.navigate('SiteDetail', { site })}
              >
                <RemoteImage uri={site.image} style={styles.savedImage} fallbackLabel={site.name} />
                <View style={styles.savedInfo}>
                  <Text style={styles.savedName}>{site.name}</Text>
                  <Text style={styles.savedLoc}>{site.location}</Text>
                </View>
                <Ionicons name="heart" size={20} color={colors.danger} />
              </Pressable>
            ))
          ) : tab === 'Bookings' ? (
            bookings.slice(0, 3).map((b) => (
              <View key={b.id} style={styles.savedCard}>
                <RemoteImage uri={b.avatar} style={styles.bookingAvatar} fallbackLabel={b.guide ?? b.hotel} />
                <View style={styles.savedInfo}>
                  <Text style={styles.savedName}>{b.guide ?? b.hotel}</Text>
                  <Text style={styles.savedLoc}>
                    {b.site} · {b.date}
                  </Text>
                </View>
                <Text style={styles.bookingAmount}>{b.amount}</Text>
              </View>
            ))
          ) : (
            <EmptyState
              icon="star-outline"
              title="No reviews yet"
              subtitle="Visit a site and share your experience."
              actionLabel="Explore Sites"
              onAction={() => navigation.navigate('Explore')}
            />
          )}
        </View>

        <Text style={styles.settingsTitle}>Settings</Text>
        <View style={styles.menuCard}>
          {renderMenuRow('person-outline', 'Edit Profile', () => navigation.navigate('EditProfile'))}
          <View style={styles.menuDivider} />
          {renderMenuRow('notifications-outline', 'Notification Center', () =>
            navigation.navigate('Notifications')
          )}
        </View>

        <View style={styles.menuCard}>
          <View style={styles.menuRow}>
            <View style={styles.menuIcon}>
              <Ionicons name="notifications-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>Push Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.menuDivider} />
          <View style={styles.menuRow}>
            <View style={styles.menuIcon}>
              <Ionicons name="moon-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>Dark Mode</Text>
            <Switch
              value={scheme === 'dark'}
              onValueChange={toggleScheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.menuCard}>
          {renderMenuRow('diamond-outline', 'Go Premium', () => navigation.navigate('Premium'))}
          <View style={styles.menuDivider} />
          {renderMenuRow('help-circle-outline', 'Help & Support', () =>
            navigation.navigate('HelpSupport')
          )}
          <View style={styles.menuDivider} />
          {renderMenuRow('shield-checkmark-outline', 'Terms & Privacy')}
        </View>

        <View style={styles.menuCard}>
          {renderMenuRow('log-out-outline', 'Log Out', () => navigation.replace('Login'), {
            danger: true,
          })}
        </View>

        <Text style={styles.version}>Hidden Ghana v1.0.0</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingHorizontal: spacing.lg },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 54,
      paddingBottom: spacing.lg,
    },
    headerTitle: { ...typography.h2, color: colors.textPrimary },
    editBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    editText: { ...typography.caption, color: colors.white, fontWeight: '700' },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    avatarInitials: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    avatarInitialsText: { color: colors.white, fontWeight: '800', fontSize: 26 },
    profileInfo: { flex: 1, gap: 2 },
    name: { ...typography.h3, color: colors.textPrimary },
    email: { ...typography.caption, color: colors.textSecondary },
    locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    location: { ...typography.label, color: colors.textMuted },
    premiumPrompt: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: 'rgba(245,166,35,0.35)',
      padding: spacing.md,
      marginTop: spacing.md,
    },
    premiumIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(245,166,35,0.16)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    premiumText: { flex: 1 },
    premiumTitle: { ...typography.bodyBold, color: colors.textPrimary },
    premiumSub: { ...typography.label, color: colors.textMuted, marginTop: 2 },
    statsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.lg },
    statCard: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: spacing.md,
    },
    statValue: { ...typography.h3, color: colors.primary, fontWeight: '800' },
    statLabel: { ...typography.label, color: colors.textMuted, marginTop: 2 },
    tabContent: { gap: spacing.sm, marginBottom: spacing.lg },
    savedCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.sm,
    },
    savedImage: { width: 56, height: 56, borderRadius: radius.md },
    bookingAvatar: { width: 48, height: 48, borderRadius: 24 },
    savedInfo: { flex: 1 },
    savedName: { ...typography.bodyBold, color: colors.textPrimary },
    savedLoc: { ...typography.label, color: colors.textMuted, marginTop: 2 },
    bookingAmount: { ...typography.bodyBold, color: colors.primary, fontWeight: '800' },
    settingsTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
    menuCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
      overflow: 'hidden',
    },
    menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
    },
    menuIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuIconDanger: { backgroundColor: colors.dangerMuted },
    menuLabel: { flex: 1, ...typography.bodyBold, color: colors.textPrimary },
    menuLabelDanger: { color: colors.danger },
    menuValue: { ...typography.caption, color: colors.textMuted },
    menuDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginLeft: 60,
    },
    version: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
  });
