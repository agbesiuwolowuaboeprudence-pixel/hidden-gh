import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../components/ui/ScreenHeader';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { bookings } from '../data/mockData';
import { radius, spacing, typography, useTheme, type Palette } from '../theme';
import type { Booking, BookingStatus } from '../types';
import type { MainTabScreenProps } from '../types/navigation';

type Props = MainTabScreenProps<'Trips'>;
type Segment = BookingStatus;

const STATUS_META: Record<BookingStatus, { color: keyof Palette; icon: keyof typeof Ionicons.glyphMap }> = {
  Upcoming: { color: 'primary', icon: 'time-outline' },
  Completed: { color: 'success', icon: 'checkmark-circle-outline' },
  Cancelled: { color: 'danger', icon: 'close-circle-outline' },
};

export default function TripsScreen({ navigation }: Props) {
  const { colors, scheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [segment, setSegment] = useState<Segment>('Upcoming');

  const filtered = bookings.filter((b) => b.status === segment);

  const renderItem = ({ item }: { item: Booking }) => {
    const statusColor = colors[STATUS_META[item.status].color] as string;
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.siteImage }} style={styles.cardImage} />
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <View style={styles.typeChip}>
              <Ionicons
                name={item.type === 'guide' ? 'person-outline' : 'bed-outline'}
                size={12}
                color={colors.primary}
              />
              <Text style={styles.typeText}>{item.type === 'guide' ? 'Guide' : 'Hotel'}</Text>
            </View>
            <View style={[styles.statusChip, { backgroundColor: `${statusColor}22` }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>{item.guide ?? item.hotel}</Text>
          <Text style={styles.cardSite} numberOfLines={1}>
            {item.site}
          </Text>
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
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScreenHeader title="My Trips" subtitle="Guides & hotel bookings" />
      <SegmentedControl
        options={[
          { value: 'Upcoming' as const, label: 'Upcoming' },
          { value: 'Completed' as const, label: 'Completed' },
          { value: 'Cancelled' as const, label: 'Cancelled' },
        ]}
        value={segment}
        onChange={setSegment}
      />
      {filtered.length === 0 ? (
        <EmptyState
          icon="briefcase-outline"
          title={`No ${segment.toLowerCase()} trips`}
          subtitle="Book a guide or hotel to start planning your journey."
          actionLabel="Explore Sites"
          onAction={() => navigation.navigate('Explore')}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    list: { paddingHorizontal: spacing.lg, paddingBottom: 100, gap: spacing.md },
    card: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    cardImage: { width: 96, height: '100%', minHeight: 150 },
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
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    ref: { ...typography.label, color: colors.textMuted },
    amount: { ...typography.bodyBold, color: colors.primary, fontWeight: '800' },
  });
