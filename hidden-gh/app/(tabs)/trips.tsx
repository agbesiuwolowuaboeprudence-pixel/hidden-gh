import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { EmptyState, ScreenHeader } from '@/src/components/ui/ScreenHeader';
import { SegmentedControl } from '@/src/components/ui/SegmentedControl';
import { getMyBookingsByStatus } from '@/src/services/bookingService';
import { radius, spacing, typography, useTheme, type Palette } from '@/src/theme';
import type { Booking, BookingStatus } from '@/src/types';

type Segment = BookingStatus;

const STATUS_COLOR_KEY: Record<BookingStatus, keyof Palette> = {
  Upcoming: 'primary',
  Completed: 'success',
  Cancelled: 'danger',
};

export default function TripsScreen() {
  const { colors, scheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [segment, setSegment] = useState<Segment>('Upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await getMyBookingsByStatus(segment);
      setBookings(data);
    } catch (err) {
      console.error('[TripsScreen]', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [segment]);

  useEffect(() => {
    setLoading(true);
    fetchBookings();
  }, [fetchBookings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const renderItem = ({ item }: { item: Booking }) => {
    const statusColor = colors[STATUS_COLOR_KEY[item.status]] as string;
    return (
      <View style={styles.card}>
        {item.siteImage ? (
          <Image source={{ uri: item.siteImage }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
            <Ionicons name={item.type === 'guide' ? 'person' : 'bed'} size={28} color={colors.textMuted} />
          </View>
        )}
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <View style={styles.typeChip}>
              <Ionicons name={item.type === 'guide' ? 'person-outline' : 'bed-outline'} size={12} color={colors.primary} />
              <Text style={styles.typeText}>{item.type === 'guide' ? 'Guide' : 'Hotel'}</Text>
            </View>
            <View style={[styles.statusChip, { backgroundColor: `${statusColor}22` }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>{item.guide ?? item.hotel}</Text>
          <Text style={styles.cardSite} numberOfLines={1}>{item.site}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
              <Text style={styles.metaText}>{item.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color={colors.textMuted} />
              <Text style={styles.metaText}>{item.duration}</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.ref}>{item.bookingRef}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScreenHeader title="My Trips" subtitle="Guides & hotel bookings" />
      <SegmentedControl
        options={[
          { value: 'Upcoming' as const, label: 'Upcoming' },
          { value: 'Completed' as const, label: 'Completed' },
          { value: 'Cancelled' as const, label: 'Cancelled' },
        ]}
        value={segment}
        onChange={(val) => setSegment(val)}
      />
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 48 }} />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon="briefcase-outline"
          title={`No ${segment.toLowerCase()} trips`}
          subtitle="Book a guide or hotel to start planning your journey."
          actionLabel="Explore Sites"
          onAction={() => router.push('/(tabs)/explore')}
        />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        />
      )}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    list: { paddingHorizontal: spacing.lg, paddingBottom: 100, gap: spacing.md },
    card: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
    cardImage: { width: 96, height: '100%', minHeight: 150 },
    cardImagePlaceholder: { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
    cardBody: { flex: 1, padding: spacing.md, gap: 4 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    typeChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    typeText: { ...typography.label, color: colors.primary, fontWeight: '700' },
    statusChip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full },
    statusText: { ...typography.label, fontWeight: '700' },
    cardTitle: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 15, marginTop: 2 },
    cardSite: { ...typography.caption, color: colors.textSecondary },
    metaRow: { flexDirection: 'row', gap: spacing.md, marginTop: 4 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { ...typography.label, color: colors.textMuted },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
    ref: { ...typography.label, color: colors.textMuted },
    amount: { ...typography.bodyBold, color: colors.primary, fontWeight: '800' },
  });
