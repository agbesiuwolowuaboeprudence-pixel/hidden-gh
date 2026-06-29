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
  primary:       '#1B5E3B',
  primaryDark:   '#0F3D22',
  accent:        '#F5A623',
  white:         '#FFFFFF',
  black:         '#111111',
  bg:            '#F8F7F2',
  textPrimary:   '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted:     '#A0A0A0',
};

// ─── SLIDES DATA ─────────────────────────────────────────────────────────────

const SLIDES = [
  {
    id: '1',
    title: 'Discover Hidden\nGhana',
    subtitle: 'Explore over 200 tourist sites, cultural landmarks and natural wonders across all 16 regions of Ghana.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    accent: '#1B5E3B',
  },
  {
    id: '2',
    title: 'Connect with\nLocal Guides',
    subtitle: 'Video call or message certified local guides who bring Ghana\'s history and culture to life.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    accent: '#0F3D22',
  },
  {
    id: '3',
    title: 'Book Hotels\n& Stays',
    subtitle: 'Find and book accommodation near every tourist site, from luxury resorts to authentic local stays.',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
    accent: '#1B5E3B',
  },
  {
    id: '4',
    title: 'Unlock Premium\nExperiences',
    subtitle: 'Access in-depth history, 3D site exploration and immersive VR tours of Ghana\'s greatest landmarks.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    accent: '#0F3D22',
  },
];

// ─── SLIDE ITEM ───────────────────────────────────────────────────────────────

function SlideItem({ item }) {
  return (
    <View style={[styles.slide, { width }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.slideImage}
        resizeMode="cover"
      />
      <View style={styles.slideOverlay} />
      <View style={styles.slideContent}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>Hidden </Text>
          <Text style={styles.logoBadgeAccent}>GH★NA</Text>
        </View>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const handleGetStarted = () => {
    navigation.replace('Login');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Skip button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => <SlideItem item={item} />}
      />

      {/* Bottom controls */}
      <View style={styles.bottomControls}>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                flatListRef.current?.scrollToIndex({ index });
                setCurrentIndex(index);
              }}
            >
              <View style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Action button */}
        {isLastSlide ? (
          <View style={styles.lastSlideActions}>
            <TouchableOpacity
              style={styles.getStartedBtn}
              onPress={handleGetStarted}
            >
              <Text style={styles.getStartedBtnText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginLinkBtn}
              onPress={() => navigation.replace('Login')}
            >
              <Text style={styles.loginLinkText}>
                Already have an account?{' '}
                <Text style={styles.loginLinkAccent}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>Next  →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.black },

  // Skip
  skipBtn: {
    position: 'absolute',
    top: 54,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skipText: { fontSize: 13, color: C.white, fontWeight: '600' },

  // Slide
  slide:        { flex: 1, height },
  slideImage:   { width: '100%', height: '100%', position: 'absolute' },
  slideOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 180,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  logoBadgeText:   { fontSize: 16, color: C.white, fontStyle: 'italic', fontWeight: '600' },
  logoBadgeAccent: { fontSize: 18, color: C.accent, fontWeight: '800', letterSpacing: 1 },
  slideTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: C.white,
    lineHeight: 44,
    marginBottom: 16,
  },
  slideSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.80)',
    lineHeight: 24,
  },

  // Bottom controls
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 24,
    backgroundColor: C.accent,
  },

  // Next button
  nextBtn: {
    backgroundColor: C.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextBtnText: { fontSize: 16, color: C.white, fontWeight: '700' },

  // Last slide
  lastSlideActions: { gap: 14 },
  getStartedBtn: {
    backgroundColor: C.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  getStartedBtnText: { fontSize: 16, color: C.black, fontWeight: '800' },
  loginLinkBtn:      { alignItems: 'center' },
  loginLinkText:     { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  loginLinkAccent:   { color: C.accent, fontWeight: '700' },
});