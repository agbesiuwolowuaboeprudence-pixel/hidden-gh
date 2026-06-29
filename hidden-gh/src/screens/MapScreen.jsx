import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';

// ─── COLORS ──────────────────────────────────────────────────────────────────

const C = {
  primary:       '#1B5E3B',
  primaryDark:   '#0F3D22',
  accent:        '#F5A623',
  white:         '#FFFFFF',
  black:         '#111111',
  bg:            '#F8F7F2',
  card:          '#FFFFFF',
  textPrimary:   '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted:     '#A0A0A0',
  border:        '#E8E8E8',
  premium:       '#C9A84C',
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const SITES = [
  {
    id: '1',
    name: 'Cape Coast Castle',
    location: 'Cape Coast, Central Region',
    category: 'Historical',
    lat: 5.1047,
    lng: -1.2427,
    entryFee: 'GHS 80',
    rating: 4.8,
    color: '#E53935',
  },
  {
    id: '2',
    name: 'Kakum National Park',
    location: 'Central Region',
    category: 'Nature',
    lat: 5.3500,
    lng: -1.3833,
    entryFee: 'GHS 120',
    rating: 4.7,
    color: '#2E7D52',
  },
  {
    id: '3',
    name: 'Mole National Park',
    location: 'Savannah Region',
    category: 'Wildlife',
    lat: 9.2610,
    lng: -1.8558,
    entryFee: 'GHS 150',
    rating: 4.9,
    color: '#F57F17',
  },
  {
    id: '4',
    name: 'Labadi Beach',
    location: 'Accra, Greater Accra',
    category: 'Beach',
    lat: 5.5571,
    lng: -0.1469,
    entryFee: 'GHS 40',
    rating: 4.5,
    color: '#1565C0',
  },
  {
    id: '5',
    name: 'Larabanga Mosque',
    location: 'Savannah Region',
    category: 'Cultural',
    lat: 9.2259,
    lng: -1.8583,
    entryFee: 'GHS 30',
    rating: 4.6,
    color: '#6A1B9A',
  },
  {
    id: '6',
    name: 'Elmina Castle',
    location: 'Elmina, Central Region',
    category: 'Historical',
    lat: 5.0843,
    lng: -1.3490,
    entryFee: 'GHS 70',
    rating: 4.7,
    color: '#E53935',
  },
  {
    id: '7',
    name: 'Boti Falls',
    location: 'Eastern Region',
    category: 'Nature',
    lat: 6.5833,
    lng: -0.1167,
    entryFee: 'GHS 50',
    rating: 4.5,
    color: '#2E7D52',
  },
  {
    id: '8',
    name: 'Kwame Nkrumah Memorial',
    location: 'Accra, Greater Accra',
    category: 'Historical',
    lat: 5.5502,
    lng: -0.2070,
    entryFee: 'GHS 60',
    rating: 4.6,
    color: '#E53935',
  },
  {
    id: '9',
    name: 'Lake Bosomtwe',
    location: 'Ashanti Region',
    category: 'Nature',
    lat: 6.4990,
    lng: -1.4080,
    entryFee: 'GHS 45',
    rating: 4.7,
    color: '#2E7D52',
  },
  {
    id: '10',
    name: 'Paga Crocodile Pond',
    location: 'Upper East Region',
    category: 'Wildlife',
    lat: 10.9833,
    lng: -1.1167,
    entryFee: 'GHS 35',
    rating: 4.4,
    color: '#F57F17',
  },
];

const CATEGORIES = ['All', 'Historical', 'Nature', 'Wildlife', 'Beach', 'Cultural'];

const CATEGORY_COLORS = {
  Historical: '#E53935',
  Nature:     '#2E7D52',
  Wildlife:   '#F57F17',
  Beach:      '#1565C0',
  Cultural:   '#6A1B9A',
};

// ─── BUILD MAP HTML ───────────────────────────────────────────────────────────

function buildMapHTML(sites, selectedSite) {
  const markers = sites.map((site) => `
    L.circleMarker([${site.lat}, ${site.lng}], {
      radius: 12,
      fillColor: '${site.color}',
      color: '#ffffff',
      weight: 2.5,
      opacity: 1,
      fillOpacity: 0.9,
    })
    .addTo(map)
    .bindPopup(\`
      <div style="font-family:sans-serif;min-width:180px;padding:4px;">
        <div style="font-size:14px;font-weight:800;color:#1A1A1A;margin-bottom:4px;">
          ${site.name}
        </div>
        <div style="font-size:11px;color:#6B6B6B;margin-bottom:6px;">
          ${site.location}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="background:#E8F5EE;color:#1B5E3B;font-size:11px;font-weight:700;padding:3px 8px;border-radius:10px;">
            ${site.category}
          </span>
          <span style="font-size:12px;font-weight:800;color:#1B5E3B;">
            ${site.entryFee}
          </span>
        </div>
        <div style="margin-top:6px;font-size:12px;color:#F5A623;font-weight:700;">
          ★ ${site.rating}
        </div>
      </div>
    \`);
  `).join('\n');

  const centerLat = selectedSite ? selectedSite.lat : 7.9465;
  const centerLng = selectedSite ? selectedSite.lng : -1.0232;
  const zoom      = selectedSite ? 12 : 7;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        html, body, #map { width:100%; height:100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: true,
          attributionControl: false,
        }).setView([${centerLat}, ${centerLng}], ${zoom});

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        ${markers}
      </script>
    </body>
    </html>
  `;
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function MapScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSite, setSelectedSite]         = useState(null);
  const [showList, setShowList]                 = useState(false);

  const filteredSites =
    selectedCategory === 'All'
      ? SITES
      : SITES.filter((s) => s.category === selectedCategory);

  const mapHTML = buildMapHTML(filteredSites, selectedSite);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Explore Map</Text>
          <Text style={styles.headerSub}>{filteredSites.length} sites on map</Text>
        </View>
        <TouchableOpacity
          style={styles.listToggleBtn}
          onPress={() => setShowList(!showList)}
        >
          <Text style={styles.listToggleBtnText}>
            {showList ? 'Show Map' : 'Show List'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── CATEGORY PILLS ── */}
      <View style={styles.pillsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => {
                setSelectedCategory(cat);
                setSelectedSite(null);
              }}
              style={[
                styles.pill,
                selectedCategory === cat && styles.pillActive,
                cat !== 'All' && selectedCategory === cat && {
                  backgroundColor: CATEGORY_COLORS[cat],
                  borderColor: CATEGORY_COLORS[cat],
                },
              ]}
            >
              <Text style={[
                styles.pillText,
                selectedCategory === cat && styles.pillTextActive,
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── MAP VIEW ── */}
      {!showList && (
        <View style={styles.mapContainer}>
          <WebView
            key={`${selectedCategory}-${selectedSite?.id}`}
            source={{ html: mapHTML }}
            style={styles.map}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            renderLoading={() => (
              <View style={styles.mapLoading}>
                <Text style={styles.mapLoadingText}>Loading map...</Text>
              </View>
            )}
          />

          {/* Legend */}
          <View style={styles.legend}>
            {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
              <View key={cat} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={styles.legendText}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ── LIST VIEW ── */}
      {showList && (
        <ScrollView
          style={styles.siteList}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredSites.map((site) => (
            <TouchableOpacity
              key={site.id}
              style={[
                styles.siteRow,
                selectedSite?.id === site.id && styles.siteRowActive,
              ]}
              onPress={() => {
                setSelectedSite(site);
                setShowList(false);
              }}
              activeOpacity={0.85}
            >
              <View style={[styles.siteColorDot, { backgroundColor: site.color }]} />
              <View style={styles.siteInfo}>
                <Text style={styles.siteName}>{site.name}</Text>
                <Text style={styles.siteLocation}>{site.location}</Text>
                <View style={styles.siteMeta}>
                  <Text style={styles.siteCategory}>{site.category}</Text>
                  <Text style={styles.siteRating}>★ {site.rating}</Text>
                  <Text style={styles.siteFee}>{site.entryFee}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.siteDirectionBtn}
                onPress={() => {
                  setSelectedSite(site);
                  setShowList(false);
                }}
              >
                <Text style={styles.siteDirectionBtnText}>Pin</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ── SELECTED SITE BOTTOM CARD ── */}
      {selectedSite && !showList && (
        <View style={styles.selectedCard}>
          <View style={styles.selectedCardTop}>
            <View style={[
              styles.selectedCategoryBadge,
              { backgroundColor: selectedSite.color },
            ]}>
              <Text style={styles.selectedCategoryText}>
                {selectedSite.category}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.selectedClose}
              onPress={() => setSelectedSite(null)}
            >
              <Text style={styles.selectedCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.selectedName}>{selectedSite.name}</Text>
          <Text style={styles.selectedLocation}>{selectedSite.location}</Text>

          <View style={styles.selectedMeta}>
            <View style={styles.selectedMetaItem}>
              <Text style={styles.selectedMetaLabel}>Entry Fee</Text>
              <Text style={styles.selectedMetaValue}>{selectedSite.entryFee}</Text>
            </View>
            <View style={styles.selectedMetaDivider} />
            <View style={styles.selectedMetaItem}>
              <Text style={styles.selectedMetaLabel}>Rating</Text>
              <Text style={styles.selectedMetaValue}>★ {selectedSite.rating}</Text>
            </View>
            <View style={styles.selectedMetaDivider} />
            <View style={styles.selectedMetaItem}>
              <Text style={styles.selectedMetaLabel}>Category</Text>
              <Text style={styles.selectedMetaValue}>{selectedSite.category}</Text>
            </View>
          </View>

          <View style={styles.selectedActions}>
            <TouchableOpacity
              style={styles.selectedViewBtn}
              onPress={() => navigation.navigate('SiteDetail', { site: selectedSite })}
            >
              <Text style={styles.selectedViewBtnText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectedDirectionBtn}>
              <Text style={styles.selectedDirectionBtnText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 8,
    backgroundColor: C.bg,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.textPrimary },
  headerSub:   { fontSize: 12, color: C.textMuted, marginTop: 2 },
  listToggleBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  listToggleBtnText: { fontSize: 12, color: C.white, fontWeight: '600' },

  // Pills
  pillsContainer: {
    height: 44,
    justifyContent: 'center',
    backgroundColor: C.bg,
  },
  pillsRow: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
    height: 44,
  },
  pill: {
    height: 30,
    paddingHorizontal: 14,
    borderRadius: 15,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive:     { backgroundColor: C.primary, borderColor: C.primary },
  pillText:       { fontSize: 12, color: C.textSecondary, fontWeight: '600' },
  pillTextActive: { color: C.white, fontWeight: '700' },

  // Map
  mapContainer: { flex: 1, position: 'relative' },
  map:          { flex: 1 },
  mapLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.bg,
  },
  mapLoadingText: { fontSize: 14, color: C.textMuted },

  // Legend
  legend: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 10,
    gap: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:  { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: C.textPrimary, fontWeight: '500' },

  // Site list
  siteList: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  siteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: C.border,
    gap: 12,
  },
  siteRowActive:  { borderColor: C.primary, borderWidth: 1.5 },
  siteColorDot:   { width: 14, height: 14, borderRadius: 7, flexShrink: 0 },
  siteInfo:       { flex: 1 },
  siteName:       { fontSize: 14, fontWeight: '700', color: C.textPrimary, marginBottom: 3 },
  siteLocation:   { fontSize: 11, color: C.textMuted, marginBottom: 6 },
  siteMeta:       { flexDirection: 'row', gap: 10, alignItems: 'center' },
  siteCategory:   { fontSize: 10, color: C.primary, fontWeight: '700', textTransform: 'uppercase' },
  siteRating:     { fontSize: 11, color: C.accent, fontWeight: '700' },
  siteFee:        { fontSize: 11, color: C.textSecondary, fontWeight: '600' },
  siteDirectionBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  siteDirectionBtnText: { fontSize: 12, color: C.white, fontWeight: '700' },

  // Selected card
  selectedCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 34,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  selectedCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  selectedCategoryText: { fontSize: 12, color: C.white, fontWeight: '700' },
  selectedClose: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCloseText: { fontSize: 14, color: C.textMuted, fontWeight: '700' },
  selectedName:     { fontSize: 18, fontWeight: '800', color: C.textPrimary, marginBottom: 4 },
  selectedLocation: { fontSize: 13, color: C.textMuted, marginBottom: 14 },
  selectedMeta: {
    flexDirection: 'row',
    backgroundColor: C.bg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  selectedMetaItem:    { flex: 1, alignItems: 'center' },
  selectedMetaDivider: { width: 0.5, backgroundColor: C.border },
  selectedMetaLabel:   { fontSize: 10, color: C.textMuted, marginBottom: 4 },
  selectedMetaValue:   { fontSize: 14, fontWeight: '800', color: C.textPrimary },
  selectedActions:     { flexDirection: 'row', gap: 10 },
  selectedViewBtn: {
    flex: 1,
    backgroundColor: C.primary,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  selectedViewBtnText: { fontSize: 14, color: C.white, fontWeight: '700' },
  selectedDirectionBtn: {
    flex: 1,
    backgroundColor: C.bg,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.primary,
  },
  selectedDirectionBtnText: { fontSize: 14, color: C.primary, fontWeight: '700' },
});