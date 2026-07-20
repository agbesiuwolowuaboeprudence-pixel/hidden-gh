import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { RatingStars } from '../components/ui/RatingStars';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { radius, spacing, typography, useTheme, type Palette } from '../theme';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'GuideDetail'>;

export default function GuideDetailScreen({ navigation, route }: Props) {
  const { colors, scheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { guide } = route.params;

  const stats = [
    { label: 'Rating', value: guide.rating.toFixed(1) },
    { label: 'Tours', value: String(guide.tours ?? '—') },
    { label: 'Experience', value: guide.experience ?? '—' },
  ];

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScreenHeader title="Guide" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: guide.avatar }} style={styles.avatar} />
            <View
              style={[
                styles.availDot,
                { backgroundColor: guide.available ? colors.online : colors.offline },
              ]}
            />
          </View>
          <Text style={styles.name}>{guide.name}</Text>
          <Text style={styles.speciality}>{guide.speciality}</Text>
          <View style={styles.regionRow}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.region}>{guide.region}</Text>
          </View>
          <View style={styles.ratingWrap}>
            <RatingStars rating={guide.rating} reviewCount={guide.reviews} size={15} />
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{guide.bio}</Text>

        <Text style={styles.sectionTitle}>Languages</Text>
        <View style={styles.tagRow}>
          {guide.languages.map((lang) => (
            <View key={lang} style={styles.tag}>
              <Text style={styles.tagText}>{lang}</Text>
            </View>
          ))}
        </View>

        {guide.sites && guide.sites.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Sites covered</Text>
            <View style={styles.siteList}>
              {guide.sites.map((s) => (
                <View key={s} style={styles.siteRow}>
                  <View style={styles.siteIcon}>
                    <Ionicons name="navigate-outline" size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.siteText}>{s}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Rate</Text>
          <Text style={styles.bottomPrice}>{guide.price ?? 'On request'}</Text>
        </View>
        <Button
          label={guide.available ? 'Book this Guide' : 'Currently Unavailable'}
          icon="calendar-outline"
          disabled={!guide.available}
          onPress={() => navigation.navigate('Main', { screen: 'Trips' })}
          style={styles.bookBtn}
        />
      </View>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.md },
    card: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.xl,
    },
    avatarWrap: { marginBottom: spacing.md },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    availDot: {
      position: 'absolute',
      bottom: 4,
      right: 4,
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 3,
      borderColor: colors.surface,
    },
    name: { ...typography.h2, color: colors.textPrimary },
    speciality: { ...typography.bodyBold, color: colors.primary, marginTop: 4 },
    regionRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    region: { ...typography.caption, color: colors.textMuted },
    ratingWrap: { marginTop: spacing.md },
    statsRow: { flexDirection: 'row', gap: spacing.md },
    statCard: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: spacing.md,
    },
    statValue: { ...typography.h3, color: colors.textPrimary },
    statLabel: { ...typography.label, color: colors.textMuted, marginTop: 2 },
    sectionTitle: { ...typography.h3, color: colors.textPrimary, marginTop: spacing.sm },
    bio: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    tag: {
      backgroundColor: colors.primaryMuted,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
    },
    tagText: { ...typography.caption, color: colors.primary, fontWeight: '700' },
    siteList: { gap: spacing.sm },
    siteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
    },
    siteIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    siteText: { ...typography.bodyBold, color: colors.textPrimary },
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: 28,
      backgroundColor: colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    bottomLabel: { ...typography.label, color: colors.textMuted },
    bottomPrice: { ...typography.h3, color: colors.textPrimary },
    bookBtn: { paddingHorizontal: spacing.lg },
  });
