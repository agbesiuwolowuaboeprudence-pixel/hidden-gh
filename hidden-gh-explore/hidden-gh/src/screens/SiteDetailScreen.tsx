import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { RatingStars } from '../components/ui/RatingStars';
import { radius, spacing, typography, useTheme, type Palette } from '../theme';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'SiteDetail'>;

export default function SiteDetailScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { site } = route.params;
  const [saved, setSaved] = useState(false);

  const meta = [
    { icon: 'time-outline' as const, label: site.openingHours },
    { icon: 'cash-outline' as const, label: site.entryFee },
    ...(site.phone ? [{ icon: 'call-outline' as const, label: site.phone }] : []),
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Image source={{ uri: site.image }} style={styles.heroImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(10,10,11,0.9)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroTop}>
            <Pressable style={styles.circleBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </Pressable>
            <Pressable style={styles.circleBtn} onPress={() => setSaved((s) => !s)}>
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={22}
                color={saved ? colors.danger : colors.white}
              />
            </Pressable>
          </View>
          <View style={styles.heroBottom}>
            <View style={styles.heroBadges}>
              <Badge label={site.category} />
              {site.isPremium ? <Badge label="Premium" variant="premium" /> : null}
            </View>
            <Text style={styles.heroTitle}>{site.name}</Text>
            <View style={styles.heroLoc}>
              <Ionicons name="location" size={14} color={colors.primary} />
              <Text style={styles.heroLocText}>{site.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.ratingRow}>
            <RatingStars rating={site.rating} reviewCount={site.reviews} size={16} />
          </View>

          <View style={styles.metaRow}>
            {meta.map((m) => (
              <View key={m.label} style={styles.metaChip}>
                <Ionicons name={m.icon} size={16} color={colors.primary} />
                <Text style={styles.metaText} numberOfLines={1}>
                  {m.label}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.desc}>{site.longDescription ?? site.description}</Text>

          {site.highlights && site.highlights.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Highlights</Text>
              <View style={styles.highlights}>
                {site.highlights.map((h) => (
                  <View key={h} style={styles.highlightRow}>
                    <View style={styles.highlightDot}>
                      <Ionicons name="checkmark" size={14} color={colors.primary} />
                    </View>
                    <Text style={styles.highlightText}>{h}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          <Pressable style={styles.premiumCard} onPress={() => navigation.navigate('Premium')}>
            <View style={styles.premiumIcon}>
              <Ionicons name="diamond" size={22} color={colors.accent} />
            </View>
            <View style={styles.premiumText}>
              <Text style={styles.premiumTitle}>Unlock the full story</Text>
              <Text style={styles.premiumDesc}>
                In-depth history, audio guide, 3D & VR tours with Premium.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Entry fee</Text>
          <Text style={styles.bottomPrice}>{site.entryFee}</Text>
        </View>
        <Button
          label="Book a Guide"
          icon="person-outline"
          onPress={() => navigation.navigate('Main', { screen: 'Explore', params: { segment: 'guides' } })}
          style={styles.bookBtn}
        />
      </View>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingBottom: 120 },
    hero: { height: 340, justifyContent: 'space-between' },
    heroImage: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
    heroTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingTop: 52,
    },
    circleBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: 'rgba(0,0,0,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroBottom: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
    heroBadges: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
    heroTitle: { ...typography.h1, color: colors.white },
    heroLoc: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm },
    heroLocText: { ...typography.bodyBold, color: 'rgba(255,255,255,0.85)' },
    body: { padding: spacing.lg, gap: spacing.md },
    ratingRow: { flexDirection: 'row' },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    metaChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    metaText: { ...typography.caption, color: colors.textSecondary },
    sectionTitle: { ...typography.h3, color: colors.textPrimary, marginTop: spacing.sm },
    desc: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
    highlights: { gap: spacing.sm },
    highlightRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    highlightDot: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    highlightText: { ...typography.body, color: colors.textPrimary, flex: 1 },
    premiumCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
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
    premiumDesc: { ...typography.label, color: colors.textMuted, marginTop: 2, lineHeight: 15 },
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
    bookBtn: { paddingHorizontal: spacing.xl },
  });
