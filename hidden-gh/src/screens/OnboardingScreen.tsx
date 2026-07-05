import { Ionicons } from '@expo/vector-icons';
import { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { Button } from '../components/ui/Button';
import { radius, spacing, typography, useTheme, type Palette } from '../theme';
import type { RootStackScreenProps } from '../types/navigation';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    badge: 'Historical Sites',
    title: "Explore Ghana's\nHidden Treasures",
    subtitle: 'From ancient castles to untouched landscapes — discover the real Ghana.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  },
  {
    id: '2',
    badge: 'Waterfalls & Parks',
    title: 'Discover History,\nCulture & Nature',
    subtitle: 'Wli Waterfalls, Kakum Canopy, and sacred traditions await you.',
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=800&q=80',
  },
  {
    id: '3',
    badge: 'Expert Guides',
    title: 'Connect With\nLocal Experts',
    subtitle: 'Certified tour guides bring every story to life with authentic perspective.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  },
  {
    id: '4',
    badge: '3D & VR Tours',
    title: 'Experience Ghana\nBefore You Travel',
    subtitle: 'Explore destinations in immersive 3D and VR before setting foot there.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    isLast: true,
  },
];

type Props = RootStackScreenProps<'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const goNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index: i }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay} />
            <View style={styles.topRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
              {i < SLIDES.length - 1 ? (
                <Pressable onPress={() => navigation.replace('Login')}>
                  <Text style={styles.skip}>Skip</Text>
                </Pressable>
              ) : (
                <View style={{ width: 40 }} />
              )}
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <Button
          label={index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={goNext}
          icon={index === SLIDES.length - 1 ? 'arrow-forward' : 'chevron-forward'}
          fullWidth
        />
      </View>
    </View>
  );
}

const createStyles = (colors: Palette) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  slide: { flex: 1 },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: { ...typography.caption, color: colors.white, fontWeight: '700' },
  skip: { ...typography.bodyBold, color: colors.white },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: 160,
  },
  title: { ...typography.h1, color: colors.white, marginBottom: spacing.md },
  subtitle: { ...typography.body, color: 'rgba(255,255,255,0.8)' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
    gap: spacing.lg,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: { width: 24, backgroundColor: colors.accent },
});
