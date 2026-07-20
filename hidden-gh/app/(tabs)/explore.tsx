import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import { WebView } from 'react-native-webview';

import { Badge } from '@/src/components/ui/Badge';
import { Chip } from '@/src/components/ui/SearchBar';
import { EmptyState } from '@/src/components/ui/ScreenHeader';
import { RatingStars } from '@/src/components/ui/RatingStars';
import { ScreenHeader } from '@/src/components/ui/ScreenHeader';
import { SearchBar } from '@/src/components/ui/SearchBar';
import { SegmentedControl } from '@/src/components/ui/SegmentedControl';
import {
  categories,
  categoryColors,
  guides,
  regions,
  sortOptions,
} from '@/src/data/mockData';
import { getAllSites } from '@/src/services/siteService';
import { radius, spacing, typography, useTheme, colors as mapColors, type Palette } from '@/src/theme';
import type { Guide, TouristSite } from '@/src/types';

const { width } = Dimensions.get('window');

type Segment = 'sites' | 'map' | 'guides';

function buildMapHTML(sites: TouristSite[], selected?: TouristSite | null) {
  const markers = sites
    .filter((s) => s.lat && s.lng)
    .map(
      (site) => `
    L.circleMarker([${site.lat}, ${site.lng}], {
      radius: 12,
      fillColor: '${site.color ?? mapColors.primary}',
      color: '#ffffff',
      weight: 2.5,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(map).bindPopup('<b>${site.name}</b><br/>${site.entryFee}');`
    )
    .join('\n');

  const centerLat = selected?.lat ?? 7.9465;
  const centerLng = selected?.lng ?? -1.0232;
  const zoom = selected ? 12 : 7;

  return `<!DOCTYPE html><html><head>
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>*{margin:0;padding:0}html,body,#map{width:100%;height:100%}</style>
    </head><body><div id="map"></div><script>
    var map = L.map('map',{zoomControl:true,attributionControl:false}).setView([${centerLat},${centerLng}],${zoom});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
    ${markers}
    </script></body></html>`;
}

function SitesPanel() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [sites, setSites] = useState<TouristSite[]>([]);
  const [sitesLoaded, setSitesLoaded] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedSort, setSelectedSort] = useState('Top Rated');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    getAllSites().then((data) => { setSites(data); setSitesLoaded(true); }).catch(() => setSitesLoaded(true));
  }, []);

  let results = [...sites];
  if (searchText.trim()) {
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(searchText.toLowerCase()) ||
        s.location.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  if (selectedCategory !== 'all') results = results.filter((s) => s.category === selectedCategory);
  if (selectedRegion !== 'All Regions')
    results = results.filter((s) => s.location.includes(selectedRegion));
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
      onPress={() => router.push({ pathname: '/site-detail', params: { site: JSON.stringify(item) } })}
    >
      <Image source={{ uri: item.image }} style={styles.gridImage} />
      {item.isPremium ? (
        <View style={styles.badgePos}>
          <Badge label="Premium" variant="premium" />
        </View>
      ) : null}
      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.gridLoc} numberOfLines={1}>{item.location}</Text>
        <View style={styles.gridBottom}>
          <RatingStars rating={item.rating} size={11} />
          <Text style={styles.gridFee}>{item.entryFee}</Text>
        </View>
      </View>
    </Pressable>
  );

  const renderListItem = ({ item }: { item: TouristSite }) => (
    <Pressable
      style={styles.listCard}
      onPress={() => router.push({ pathname: '/site-detail', params: { site: JSON.stringify(item) } })}
    >
      <Image source={{ uri: item.image }} style={styles.listImage} />
      <View style={styles.listInfo}>
        <Text style={styles.listCat}>{item.category}</Text>
        <Text style={styles.listName}>{item.name}</Text>
        <Text style={styles.listDesc} numberOfLines={2}>{item.description}</Text>
        <RatingStars rating={item.rating} reviewCount={item.reviews} size={12} />
      </View>
    </Pressable>
  );

  const ListHeader = (
    <>
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
      {showFilters ? (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>Region</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipRow}>
              {regions.map((r) => (
                <Chip key={r} label={r} active={selectedRegion === r} onPress={() => setSelectedRegion(r)} />
              ))}
            </View>
          </ScrollView>
          <Text style={[styles.filterLabel, { marginTop: spacing.md }]}>Sort By</Text>
          <View style={styles.chipRowWrap}>
            {sortOptions.map((o) => (
              <Chip key={o} label={o} active={selectedSort === o} onPress={() => setSelectedSort(o)} />
            ))}
          </View>
        </View>
      ) : null}
      <View style={styles.viewToggleRow}>
        <Pressable
          style={[styles.viewBtn, viewMode === 'grid' && styles.viewBtnActive]}
          onPress={() => setViewMode('grid')}
        >
          <Ionicons name="grid-outline" size={18} color={viewMode === 'grid' ? colors.white : colors.textSecondary} />
        </Pressable>
        <Pressable
          style={[styles.viewBtn, viewMode === 'list' && styles.viewBtnActive]}
          onPress={() => setViewMode('list')}
        >
          <Ionicons name="list-outline" size={18} color={viewMode === 'list' ? colors.white : colors.textSecondary} />
        </Pressable>
      </View>
    </>
  );

  return (
    <View style={styles.panel}>
      {!sitesLoaded ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 48 }} />
      ) : results.length === 0 ? (
        <>
          {ListHeader}
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
        </>
      ) : viewMode === 'grid' ? (
        <FlatList
          ListHeaderComponent={ListHeader}
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listPad}
          renderItem={renderGridItem}
          scrollEnabled
        />
      ) : (
        <FlatList
          ListHeaderComponent={ListHeader}
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPad}
          renderItem={renderListItem}
          scrollEnabled
        />
      )}
    </View>
  );
}

function MapPanel() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [allSites, setAllSites] = useState<TouristSite[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSite, setSelectedSite] = useState<TouristSite | null>(null);

  useEffect(() => {
    getAllSites().then(setAllSites).catch(() => {});
  }, []);

  const filtered =
    selectedCategory === 'all'
      ? allSites
      : allSites.filter((s) => s.category === selectedCategory);

  return (
    <View style={styles.mapPanel}>
      <View style={styles.mapHeaderRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {['All', ...Object.keys(categoryColors)].map((cat) => (
            <Chip
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onPress={() => { setSelectedCategory(cat); setSelectedSite(null); }}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.mapWrap}>
        <WebView
          key={`${selectedCategory}-${selectedSite?.id ?? 'none'}`}
          source={{ html: buildMapHTML(filtered, selectedSite) }}
          style={styles.map}
          javaScriptEnabled
        />
        <View style={styles.colorButtonsOverlay}>
          {categories
            .filter((cat) => cat.id !== 'all')
            .map((cat) => (
              <Pressable
                key={cat.id}
                style={[styles.colorButton, { backgroundColor: categoryColors[cat.id] }]}
                onPress={() => { setSelectedCategory(cat.id); setSelectedSite(null); }}
              />
            ))}
        </View>
      </View>
      {selectedSite ? (
        <View style={styles.mapCardContainer}>
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
              onPress={() => router.push({ pathname: '/site-detail', params: { site: JSON.stringify(selectedSite) } })}
            >
              <Text style={styles.mapCardBtnText}>View Details</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function GuidesPanel() {
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

  const ListHeader = (
    <View style={styles.searchWrap}>
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        onClear={() => setSearchText('')}
        placeholder="Search guides..."
      />
    </View>
  );

  return (
    <View style={styles.panel}>
      <FlatList
        ListHeaderComponent={ListHeader}
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPad}
        renderItem={({ item }: { item: Guide }) => (
          <Pressable
            style={styles.guideCard}
            onPress={() => router.push({ pathname: '/guide-detail', params: { guide: JSON.stringify(item) } })}
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

export default function ExploreScreen() {
  const { colors, scheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{ segment?: string }>();
  const [segment, setSegment] = useState<Segment>((params.segment as Segment) ?? 'sites');

  useEffect(() => {
    if (params.segment && ['sites', 'map', 'guides'].includes(params.segment)) {
      setSegment(params.segment as Segment);
    }
  }, [params.segment]);

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
        <SitesPanel />
      ) : segment === 'map' ? (
        <MapPanel />
      ) : (
        <GuidesPanel />
      )}
    </View>
  );
}

const cardWidth = (width - 36) / 2;

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    panel: { flex: 1 },
    searchWrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
    pillsRow: { gap: spacing.sm, paddingBottom: spacing.sm, paddingVertical: 0 },
    mapHeaderRow: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.sm,
      paddingTop: spacing.sm,
    },
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
    listCat: {
      ...typography.label,
      color: colors.primary,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    listName: { ...typography.bodyBold, color: colors.textPrimary, marginVertical: 4 },
    listDesc: { ...typography.label, color: colors.textSecondary, marginBottom: 6 },
    mapPanel: { flex: 1 },
    mapWrap: {
      flex: 1,
      minHeight: 360,
      marginHorizontal: spacing.lg,
      borderRadius: radius.lg,
      overflow: 'hidden',
    },
    map: { flex: 1, minHeight: 360 },
    colorButtonsOverlay: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      padding: spacing.sm,
      borderRadius: radius.full,
    },
    colorButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.surface,
    },
    mapCardContainer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
    mapCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    mapCardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
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
