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
import { Chip } from '../components/ui/SearchBar';
import { RatingStars } from '../components/ui/RatingStars';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { hotels } from '../data/mockData';
import { radius, spacing, typography, useTheme, type Palette } from '../theme';
import type { Hotel } from '../types';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'Hotels'>;

const AMENITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Pool: 'water-outline',
  Spa: 'flower-outline',
  WiFi: 'wifi-outline',
  Gym: 'barbell-outline',
  Restaurant: 'restaurant-outline',
  'Beach Access': 'sunny-outline',
  'Safari Tours': 'paw-outline',
};

export default function HotelsScreen({ navigation }: Props) {
  const { colors, scheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const types = ['All', ...Array.from(new Set(hotels.map((h) => h.type)))];
  const [type, setType] = useState('All');

  const filtered = type === 'All' ? hotels : hotels.filter((h) => h.type === type);

  const renderItem = ({ item }: { item: Hotel }) => (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.image} />
        {item.featured ? (
          <View style={styles.badgePos}>
            <Badge label="Featured" variant="premium" />
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <RatingStars rating={item.rating} showValue size={13} />
        </View>
        <View style={styles.locRow}>
          <Ionicons name="location-outline" size={13} color={colors.textMuted} />
          <Text style={styles.loc} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <View style={styles.amenities}>
          {item.amenities.slice(0, 4).map((a) => (
            <View key={a} style={styles.amenity}>
              <Ionicons name={AMENITY_ICONS[a] ?? 'ellipse-outline'} size={13} color={colors.primary} />
              <Text style={styles.amenityText}>{a}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>{item.price}</Text>
          <Pressable style={styles.bookBtn} onPress={() => navigation.navigate('Main', { screen: 'Trips' })}>
            <Text style={styles.bookText}>Book</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScreenHeader title="Hotels & Stays" subtitle="Near Ghana's top sites" onBack={() => navigation.goBack()} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
        {types.map((t) => (
          <Chip key={t} label={t} active={type === t} onPress={() => setType(t)} />
        ))}
      </ScrollView>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    pills: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.md },
    list: { paddingHorizontal: spacing.lg, paddingBottom: 100, gap: spacing.lg },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    imageWrap: { position: 'relative' },
    image: { width: '100%', height: 160 },
    badgePos: { position: 'absolute', top: spacing.md, left: spacing.md },
    body: { padding: spacing.md, gap: spacing.sm },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
    name: { ...typography.h3, color: colors.textPrimary, flex: 1 },
    locRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    loc: { ...typography.caption, color: colors.textMuted, flex: 1 },
    amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    amenity: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.background,
      borderRadius: radius.full,
      paddingHorizontal: spacing.sm,
      paddingVertical: 5,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    amenityText: { ...typography.label, color: colors.textSecondary },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    price: { ...typography.h3, color: colors.primary, fontWeight: '800' },
    bookBtn: {
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm,
    },
    bookText: { ...typography.bodyBold, color: colors.white },
  });
