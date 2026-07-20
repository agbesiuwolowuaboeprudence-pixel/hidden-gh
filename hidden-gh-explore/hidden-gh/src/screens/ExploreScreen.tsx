import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';

import { Badge } from '../components/ui/Badge';
import { Chip } from '../components/ui/SearchBar';
import { EmptyState } from '../components/ui/ScreenHeader';
import { RatingStars } from '../components/ui/RatingStars';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SearchBar } from '../components/ui/SearchBar';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import {
  categories,
  categoryColors,
  guides,
  regions,
  sortOptions,
  touristSites,
} from '../data/mockData';
import { radius, spacing, typography, useTheme, type Palette } from '../theme';
import type { Guide, TouristSite } from '../types';
import type { MainTabScreenProps } from '../types/navigation';

const { width } = Dimensions.get('window');

type Segment = 'sites' | 'map' | 'guides';
type Props = MainTabScreenProps<'Explore'>;

// Dark Google Maps style so the native map matches the app's dark theme
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a1d' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0A0A0B' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a92' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#3a3a3f' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#173404' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#26262b' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#6b6b72' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#33333a' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c1f2e' }] },
];

const GHANA_REGION: Region = {
  latitude: 7.9465,
  longitude: -1.0232,
  latitudeDelta: 4.5,
  longitudeDelta: 4.5,
};

function SitesPanel({
  navigation,
}: {
  navigation: Props['navigation'];
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedSort, setSelectedSort] = useState('Top Rated');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  let results = [...touristSites];
  if (searchText.trim()) {
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(searchText.toLowerCase()) ||
        s.location.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  if (selectedCategory !== 'all') {
    results = results.filter((s) => s.category === selectedCategory);
  }
  if (selectedRegion !== 'All Regions') {
    results = results.filter((s) => s.location.includes(selectedRegion));
  }
  if (selectedSort === 'Top Rated') results.sort((a, b) => b.rating - a.rating);
  else if (selectedSort === 'Most Reviewed') results.sort((a, b) => b.reviews - a.reviews);
  else if (selectedSort === 'Lowest Fee') {
    results.sort(
      (a, b) =>
        parseInt(a.entryFee.replace('GHS ', '')) - parseInt(b.entryFee.replace('GHS ', ''))
    );
  } else if (selectedSort === 'A - Z') results.sort((a, b) => a.name.localeCompare(b.name));

  const renderGridItem = ({ item }: { item: TouristSite }) => (
    <Pressable
      style={styles.gridCard}
      onPress={() => navigation.navigate('SiteDetail', { site: item })}
    >
      <Image source={{ uri: item.image }} style={styles.gridImage} />
      {item.isPremium ? (
        <View style={styles.badgePos}>
          <Badge label="Premium" variant="premium" />
        </View>
      ) : null}
      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.gridLoc} numberOfLines={1}>
          {item.location}
        </Text>
        <View style={styles.gridBottom}>
          <RatingStars rating={item.rating} size={11} />
          <Text style={styles.gridFee}>{item.entryFee}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.panel}>
      <View style={styles.searchWrap}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onClear={() => setSearchText('')}
          onFilterPress={() => setShowFilters(!showFilters)}
          filterActive={showFilters}
          placeholder="Search sites, regions..."
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.label}
            active={selectedCategory === cat.id}
            onPress={() => setSelectedCategory(cat.id)}
          />
        ))}
      </ScrollView>
      {showFilters ? (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>Region</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipRow}>
              {regions.map((r) => (
                <Chip
                  key={r}
                  label={r}
                  active={selectedRegion === r}
                  onPress={() => setSelectedRegion(r)}
                />
              ))}
            </View>
          </ScrollView>
          <Text style={[styles.filterLabel, { marginTop: spacing.md }]}>Sort By</Text>
          <View style={styles.chipRowWrap}>
            {sortOptions.map((o) => (
              <Chip
                key={o}
                label={o}
                active={selectedSort === o}
                onPress={() => setSelectedSort(o)}
              />
            ))}
          </View>
        </View>
      ) : null}
      <View style={styles.viewToggleRow}>
        <Pressable
          style={[styles.viewBtn, viewMode === 'grid' && styles.viewBtnActive]}
          onPress={() => setViewMode('grid')}
        >
          <Ionicons
            name="grid-outline"
            size={18}
            color={viewMode === 'grid' ? colors.white : colors.textSecondary}
          />
        </Pressable>
        <Pressable
          style={[styles.viewBtn, viewMode === 'list' && styles.viewBtnActive]}
          onPress={() => setViewMode('list')}
        >
          <Ionicons
            name="list-outline"
            size={18}
            color={viewMode === 'list' ? colors.white : colors.textSecondary}
          />
        </Pressable>
      </View>
      {results.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No results found"
          subtitle="Try a different search or filter"
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchText('');
            setSelectedCategory('all');
            setSelectedRegion('All Regions');
          }}
        />
      ) : viewMode === 'grid' ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listPad}
          renderItem={renderGridItem}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPad}
          renderItem={({ item }) => (
            <Pressable
              style={styles.listCard}
              onPress={() => navigation.navigate('SiteDetail', { site: item })}
            >
              <Image source={{ uri: item.image }} style={styles.listImage} />
              <View style={styles.listInfo}>
                <Text style={styles.listCat}>{item.category}</Text>
                <Text style={styles.listName}>{item.name}</Text>
                <Text style={styles.listDesc} numberOfLines={2}>
                  {item.description}
                </Text>
                <RatingStars rating={item.rating} reviewCount={item.reviews} size={12} />
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

function MapPanel({ navigation }: { navigation: Props['navigation'] }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSite, setSelectedSite] = useState<TouristSite | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [locationStatus, setLocationStatus] = useState<'checking' | 'granted' | 'denied'>(
    'checking'
  );
  const [is3D, setIs3D] = useState(true);
  const mapRef = useRef<MapView | null>(null);

  const filtered =
    selectedCategory === 'All'
      ? touristSites
      : touristSites.filter((s) => s.category === selectedCategory);

  // Live location: request permission once, then keep the blue dot moving
  // as the user's actual position changes — this is the "current state of
  // the place" part, showing where they really are in real time.
  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationStatus('denied');
        return;
      }

      setLocationStatus('granted');

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 10, timeInterval: 5000 },
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      );
    })();

    return () => subscription?.remove();
  }, []);

  const recenterToMe = () => {
    if (!userLocation || !mapRef.current) return;
    mapRef.current.animateCamera(
      {
        center: userLocation,
        zoom: 14,
        pitch: is3D ? 60 : 0,
      },
      { duration: 600 }
    );
  };

  const toggle3D = () => {
    const next = !is3D;
    setIs3D(next);
    mapRef.current?.animateCamera({ pitch: next ? 60 : 0 }, { duration: 500 });
  };

  return (
    <View style={styles.mapPanel}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
        {['All', ...Object.keys(categoryColors)].map((cat) => (
          <Chip
            key={cat}
            label={cat}
            active={selectedCategory === cat}
            onPress={() => {
              setSelectedCategory(cat);
              setSelectedSite(null);
            }}
          />
        ))}
      </ScrollView>
      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={GHANA_REGION}
          customMapStyle={darkMapStyle}
          showsUserLocation={locationStatus === 'granted'}
          showsMyLocationButton={false}
          showsCompass={false}
          showsBuildings
          pitchEnabled
          rotateEnabled
          camera={{
            center: GHANA_REGION,
            pitch: is3D ? 45 : 0,
            heading: 0,
            zoom: 6.5,
          }}
        >
          {filtered
            .filter((s) => s.lat && s.lng)
            .map((site) => (
              <Marker
                key={site.id}
                coordinate={{ latitude: site.lat!, longitude: site.lng! }}
                onPress={() => setSelectedSite(site)}
              >
                <View
                  style={[
                    styles.mapMarker,
                    { backgroundColor: site.color ?? colors.primary },
                    selectedSite?.id === site.id && styles.mapMarkerActive,
                  ]}
                />
              </Marker>
            ))}
        </MapView>

        <View style={styles.mapFabColumn}>
          <Pressable style={styles.mapFab} onPress={toggle3D}>
            <Ionicons name="cube-outline" size={18} color={is3D ? colors.primary : colors.textPrimary} />
          </Pressable>
          <Pressable
            style={[styles.mapFab, !userLocation && styles.mapFabDisabled]}
            onPress={recenterToMe}
            disabled={!userLocation}
          >
            <Ionicons name="locate" size={18} color={colors.textPrimary} />
          </Pressable>
        </View>

        {locationStatus === 'denied' && (
          <View style={styles.mapLocationBanner}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.mapLocationBannerText}>
              Enable location access to see your live position on the map
            </Text>
          </View>
        )}
      </View>
      {selectedSite ? (
        <View style={styles.mapCard}>
          <View style={styles.mapCardTop}>
            <Badge label={selectedSite.category} />
            <Pressable onPress={() => setSelectedSite(null)}>
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
          <Text style={styles.mapCardTitle}>{selectedSite.name}</Text>
          <Text style={styles.mapCardLoc}>{selectedSite.location}</Text>
          <Pressable
            style={styles.mapCardBtn}
            onPress={() => navigation.navigate('SiteDetail', { site: selectedSite })}
          >
            <Text style={styles.mapCardBtnText}>View Details</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView horizontal contentContainerStyle={styles.mapSitesRow} showsHorizontalScrollIndicator={false}>
          {filtered.map((site) => (
            <Pressable key={site.id} style={styles.mapSiteChip} onPress={() => setSelectedSite(site)}>
              <View style={[styles.mapDot, { backgroundColor: site.color ?? colors.primary }]} />
              <Text style={styles.mapSiteName} numberOfLines={1}>
                {site.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function GuidesPanel({ navigation }: { navigation: Props['navigation'] }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [searchText, setSearchText] = useState('');
  const filtered = searchText.trim()
    ? guides.filter(
        (g) =>
          g.name.toLowerCase().includes(searchText.toLowerCase()) ||
          g.speciality.toLowerCase().includes(searchText.toLowerCase())
      )
    : guides;

  return (
    <View style={styles.panel}>
      <View style={styles.searchWrap}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onClear={() => setSearchText('')}
          placeholder="Search guides..."
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPad}
        renderItem={({ item }: { item: Guide }) => (
          <Pressable
            style={styles.guideCard}
            onPress={() => navigation.navigate('GuideDetail', { guide: item })}
          >
            <Image source={{ uri: item.avatar }} style={styles.guideAvatar} />
            <View style={styles.guideInfo}>
              <View style={styles.guideTop}>
                <Text style={styles.guideName}>{item.name}</Text>
                <View style={[styles.availDot, { backgroundColor: item.available ? colors.online : colors.offline }]} />
              </View>
              <Text style={styles.guideSpec}>{item.speciality}</Text>
              <Text style={styles.guideRegion}>{item.region}</Text>
              <RatingStars rating={item.rating} reviewCount={item.reviews} size={12} />
            </View>
            <View style={styles.guidePrice}>
              <Text style={styles.guidePriceText}>{item.price}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

export default function ExploreScreen({ navigation, route }: Props) {
  const { colors, scheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const initialSegment = route.params?.segment ?? 'sites';
  const [segment, setSegment] = useState<Segment>(initialSegment);

  useEffect(() => {
    if (route.params?.segment) {
      setSegment(route.params.segment);
    }
  }, [route.params?.segment]);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScreenHeader title="Explore" subtitle="Sites, map & local guides" />
      <SegmentedControl
        options={[
          { value: 'sites' as const, label: 'Sites' },
          { value: 'map' as const, label: 'Map' },
          { value: 'guides' as const, label: 'Guides' },
        ]}
        value={segment}
        onChange={setSegment}
      />
      {segment === 'sites' ? (
        <SitesPanel navigation={navigation} />
      ) : segment === 'map' ? (
        <MapPanel navigation={navigation} />
      ) : (
        <GuidesPanel navigation={navigation} />
      )}
    </View>
  );
}

const cardWidth = (width - 36) / 2;

const createStyles = (colors: Palette) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  panel: { flex: 1 },
  searchWrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  pillsRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  filterPanel: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterLabel: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  chipRow: { flexDirection: 'row', gap: spacing.sm, paddingVertical: 4 },
  chipRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  viewToggleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  viewBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  listPad: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  gridRow: { justifyContent: 'space-between', marginBottom: spacing.md },
  gridCard: {
    width: cardWidth,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  gridImage: { width: '100%', height: 120 },
  badgePos: { position: 'absolute', top: 8, left: 8 },
  gridInfo: { padding: spacing.md },
  gridName: { ...typography.caption, color: colors.textPrimary, fontWeight: '700' },
  gridLoc: { ...typography.label, color: colors.textMuted, marginVertical: 4 },
  gridBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gridFee: { ...typography.label, color: colors.primary, fontWeight: '700' },
  listCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  listImage: { width: 110, height: 120 },
  listInfo: { flex: 1, padding: spacing.md },
  listCat: { ...typography.label, color: colors.primary, fontWeight: '700', textTransform: 'uppercase' },
  listName: { ...typography.bodyBold, color: colors.textPrimary, marginVertical: 4 },
  listDesc: { ...typography.label, color: colors.textSecondary, marginBottom: 6 },
  mapPanel: { flex: 1 },
  mapWrap: { flex: 1, marginHorizontal: spacing.lg, borderRadius: radius.lg, overflow: 'hidden' },
  mapMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: '#ffffff',
  },
  mapMarkerActive: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderColor: colors.primary,
  },
  mapFabColumn: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    gap: spacing.sm,
  },
  mapFab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  mapFabDisabled: { opacity: 0.4 },
  mapLocationBanner: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  mapLocationBannerText: { ...typography.caption, color: colors.textMuted, flex: 1 },
  map: { flex: 1, minHeight: 300 },
  mapCard: {
    margin: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapCardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  mapCardTitle: { ...typography.h3, color: colors.textPrimary },
  mapCardLoc: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.md },
  mapCardBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  mapCardBtnText: { ...typography.bodyBold, color: colors.white },
  mapSitesRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: 100 },
  mapSiteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 180,
    gap: 6,
  },
  mapDot: { width: 8, height: 8, borderRadius: 4 },
  mapSiteName: { ...typography.caption, color: colors.textPrimary, flex: 1 },
  guideCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.md,
  },
  guideAvatar: { width: 56, height: 56, borderRadius: 28 },
  guideInfo: { flex: 1 },
  guideTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  guideName: { ...typography.bodyBold, color: colors.textPrimary },
  availDot: { width: 8, height: 8, borderRadius: 4 },
  guideSpec: { ...typography.caption, color: colors.primary, marginTop: 2 },
  guideRegion: { ...typography.label, color: colors.textMuted, marginBottom: 4 },
  guidePrice: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  guidePriceText: { ...typography.label, color: colors.primary, fontWeight: '700' },
});
