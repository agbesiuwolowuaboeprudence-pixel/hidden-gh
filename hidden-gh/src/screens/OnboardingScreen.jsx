import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ─── COLORS ──────────────────────────────────────────────────────────────────

const C = {
  primary: '#1B5E3B',
  accent:  '#F5A623',
  white:   '#FFFFFF',
  black:   '#000000',
};

// ─── SLIDES DATA ─────────────────────────────────────────────────────────────

const SLIDES = [
  {
    id: '1',
    badge:    'Historical Sites',
    title:    "Explore Ghana's\nHidden Treasures",
    subtitle: 'From ancient castles to untouched landscapes — discover the real Ghana.',
    image:    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    isLast:   false,
  },
  {
    id: '2',
    badge:    'Waterfalls & Parks',
    title:    'Discover History,\nCulture & Nature',
    subtitle: 'Wli Waterfalls, Kakum Canopy, and sacred traditions await you.',
    image:    'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=800&q=80',
    isLast:   false,
  },
  {
  id: '3',
  badge:    'Expert Guides',
  title:    'Connect With\nLocal Experts',
  subtitle: 'Our certified tour guides bring every story to life with authentic perspective.',
  image:    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  isLast:   false,
},
  {
    id: '4',
    badge:    '3D & VR Tours',
    title:    'Experience Ghana\nBefore You Travel',
    subtitle: 'Explore destinations in immersive 3D and VR before setting foot there.',
    image:    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    isLast:   true,
  },
];

// ─── SLIDE ITEM ───────────────────────────────────────────────────────────────

function SlideItem({ item, currentIndex, onNext, onSkip, onGetStarted }) {
  return (
    <View style={[styles.slide, { width }]}>

      {/* Full screen background image */}
      <Image
        source={{ uri: item.image }}
        style={styles.slideImage}
        resizeMode="cover"
      />

      {/* Dark overlay */}
      <View style={styles.slideOverlay} />

      {/* Top row — badge + skip */}
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
        <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom content */}
      <View style={styles.bottomContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>

        {/* Dots + button row */}
        <View style={styles.controlsRow}>

          {/* Dots */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* Button */}
          {item.isLast ? (
            <TouchableOpacity
              style={styles.getStartedBtn}
              onPress={onGetStarted}
            >
              <Text style={styles.getStartedBtnText}>Get Started  ›</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
              <Text style={styles.nextBtnText}>Next  ›</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  const goToLogin = () => navigation.replace('Login');

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <SlideItem
            item={item}
            currentIndex={currentIndex}
            onNext={goToNext}
            onSkip={goToLogin}
            onGetStarted={goToLogin}
          />
        )}
      />
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.black },

  // Slide
  slide: {
    width,
    height,
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  slideOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  // Top row
  topRow: {
    position: 'absolute',
    top: 54,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Badge
  badge: {
    borderWidth: 1.5,
    borderColor: C.accent,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  badgeText: {
    fontSize: 12,
    color: C.accent,
    fontWeight: '700',
  },

  // Skip
  skipBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  skipText: {
    fontSize: 13,
    color: C.white,
    fontWeight: '600',
  },

  // Bottom content
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 52,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: C.white,
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 23,
    marginBottom: 32,
  },

  // Controls row
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Dots
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 28,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.accent,
  },

  // Next button
  nextBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: 15,
    color: C.white,
    fontWeight: '700',
  },

  // Get started button
  getStartedBtn: {
    backgroundColor: C.accent,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  getStartedBtnText: {
    fontSize: 15,
    color: C.black,
    fontWeight: '800',
  },
});