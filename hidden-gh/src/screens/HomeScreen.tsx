import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
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
import { Chip } from '../components/ui/SearchBar';
import { RatingStars } from '../components/ui/RatingStars';
import { SearchBar } from '../components/ui/SearchBar';
import { categories, touristSites } from '../data/mockData';
import { radius, shadows, spacing, typography, useTheme, type Palette } from '../theme';
import type { MainTabScreenProps } from '../types/navigation';

type Props = MainTabScreenProps<'Home'>;

const QUICK_ACTIONS = [
  { id: 'guides', icon: 'videocam-outline' as const, label: 'Find a Guide' },
  { id: 'hotels', icon: 'bed-outline' as const, label: 'Book Hotels' },
  { id: 'explore', icon: 'map-outline' as const, label: 'Explore Map' },
  { id: 'premium', icon: 'diamond-outline' as const, label: 'Go Premium' },
];

export default function HomeScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');

  const filteredSites =
    selectedCategory === 'all'
      ? touristSites
      : touristSites.filter((s) => s.category === selectedCategory);

  const searchedSites = searchText.trim()
    ? filteredSites.filter(
        (s) =>
          s.name.toLowerCase().includes(searchText.toLowerCase()) ||
          s.location.toLowerCase().includes(searchText.toLowerCase())
      )
    : filteredSites;

  const handleQuickAction = (id: string) => {
    if (id === 'guides') {
      navigation.navigate('Explore', { segment: 'guides' });
    } else if (id === 'hotels') {
      navigation.navigate('Hotels');
    } else if (id === 'explore') {
      navigation.navigate('Explore', { segment: 'map' });
    } else if (id === 'premium') {
      navigation.navigate('Premium');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroTop}>
            <Pressable style={styles.iconBtn}>
              <Ionicons name="menu-outline" size={22} color={colors.white} />
            </Pressable>
            <Text style={styles.logo}>
              Hidden <Text style={styles.logoAccent}>Ghana</Text>
            </Text>
            <View style={styles.heroActions}>
              <Pressable
                style={styles.iconBtn}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons name="notifications-outline" size={22} color={colors.white} />
              </Pressable>
              <Pressable onPress={() => navigation.navigate('Profile')}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
                  }}
                  style={styles.avatar}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.heroTagline}>DISCOVER · EXPLORE · EXPERIENCE</Text>
            <Text style={styles.heroTitle}>Explore Ghana's{'\n'}Hidden Treasures</Text>
          </View>
          <View style={styles.heroSearch}>
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              onClear={() => setSearchText('')}
              placeholder="Search sites, cities, hotels..."
            />
          </View>
          <View style={styles.statsRow}>
            {[
              { value: '200+', label: 'Sites' },
              { value: '50+', label: 'Guides' },
              { value: '16', label: 'Regions' },
              { value: '4.8', label: 'Rating' },
            ].map((stat, i, arr) => (
              <View key={stat.label} style={styles.statWrap}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                {i < arr.length - 1 ? <View style={styles.statDivider} /> : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.body}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
          >
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.label}
                active={selectedCategory === cat.id}
                onPress={() => setSelectedCategory(cat.id)}
              />
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <Pressable onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.viewAll}>View All</Text>
            </Pressable>
          </View>

          <FlatList
            data={searchedSites.slice(0, 8)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
            renderItem={({ item }) => (
              <Pressable
                style={styles.siteCard}
                onPress={() => navigation.navigate('SiteDetail', { site: item })}
              >
                <Image source={{ uri: item.image }} style={styles.siteImage} />
                {item.isPremium ? (
                  <View style={styles.premiumWrap}>
                    <Badge label="Premium" variant="premium" />
                  </View>
                ) : null}
                <Pressable style={styles.heartBtn}>
                  <Ionicons name="heart-outline" size={18} color={colors.textPrimary} />
                </Pressable>
                <View style={styles.siteInfo}>
                  <Text style={styles.siteName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.siteDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.siteMeta}>
                    <Ionicons name="location-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.siteLocation} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>
                  <View style={styles.siteBottom}>
                    <RatingStars rating={item.rating} size={12} />
                    <Text style={styles.fee}>{item.entryFee}</Text>
                  </View>
                </View>
              </Pressable>
            )}
          />

          <View style={styles.premiumBanner}>
            <View style={styles.premiumLeft}>
              <View style={styles.premiumIcon}>
                <Ionicons name="diamond" size={24} color={colors.accent} />
              </View>
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>Unlock Ghana's True History</Text>
                <Text style={styles.premiumDesc}>
                  In-depth history, 3D tours, VR experiences and more.
                </Text>
              </View>
            </View>
            <Button
              label="Upgrade"
              onPress={() => navigation.navigate('Premium')}
              variant="secondary"
              size="sm"
            />
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickRow}>
            {QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                style={styles.quickAction}
                onPress={() => handleQuickAction(action.id)}
              >
                <View style={styles.quickIcon}>
                  <Ionicons name={action.icon} size={22} color={colors.white} />
                </View>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: Palette) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: { height: 320 },
  heroImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
  },
  iconBtn: { padding: 4 },
  logo: { ...typography.h3, color: colors.white, fontStyle: 'italic' },
  logoAccent: { color: colors.accent, fontWeight: '800', fontStyle: 'normal' },
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: colors.white,
  },
  heroContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  heroTagline: {
    ...typography.label,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  heroTitle: { ...typography.h2, color: colors.white },
  heroSearch: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  statWrap: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.bodyBold, color: colors.white, fontWeight: '800' },
  statLabel: { ...typography.label, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statDivider: {
    position: 'absolute',
    right: 0,
    width: 0.5,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  body: { paddingTop: spacing.lg },
  pillsRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  viewAll: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  cardsRow: { paddingHorizontal: spacing.lg, gap: spacing.md },
  siteCard: {
    width: 200,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  siteImage: { width: '100%', height: 130 },
  premiumWrap: { position: 'absolute', top: 8, left: 8 },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  siteInfo: { padding: spacing.md },
  siteName: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: 4 },
  siteDesc: { ...typography.label, color: colors.textSecondary, lineHeight: 15, marginBottom: 6 },
  siteMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  siteLocation: { ...typography.label, color: colors.textMuted, flex: 1 },
  siteBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fee: { ...typography.label, color: colors.primary, fontWeight: '700' },
  premiumBanner: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  premiumLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  premiumIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245,166,35,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumText: { flex: 1 },
  premiumTitle: { ...typography.bodyBold, color: colors.white, marginBottom: 4 },
  premiumDesc: { ...typography.label, color: 'rgba(255,255,255,0.65)' },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  quickAction: { alignItems: 'center', gap: spacing.sm, width: 72 },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
