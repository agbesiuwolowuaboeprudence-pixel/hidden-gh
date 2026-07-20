import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { radius, spacing, typography, useTheme, type Palette } from '../theme';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'Premium'>;

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string }[] = [
  { icon: 'book-outline', title: 'In-depth History', desc: 'Full stories behind every site, written by local historians.' },
  { icon: 'headset-outline', title: 'Audio Guides', desc: 'Narrated tours you can listen to on site or at home.' },
  { icon: 'cube-outline', title: '3D & VR Tours', desc: 'Explore destinations immersively before you travel.' },
  { icon: 'download-outline', title: 'Offline Access', desc: 'Download sites and maps for travel without signal.' },
  { icon: 'pricetag-outline', title: 'Member Discounts', desc: 'Save on guides and partner hotels across Ghana.' },
];

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: 'GHS 45', per: '/month', note: '' },
  { id: 'yearly', label: 'Yearly', price: 'GHS 360', per: '/year', note: 'Save 33%' },
];

export default function PremiumScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [plan, setPlan] = useState('yearly');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={[colors.primaryDark, colors.background]}
          style={styles.hero}
        >
          <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={colors.white} />
          </Pressable>
          <View style={styles.crown}>
            <Ionicons name="diamond" size={36} color={colors.accent} />
          </View>
          <Text style={styles.heroTitle}>Hidden Ghana Premium</Text>
          <Text style={styles.heroSub}>
            Unlock Ghana's true history with immersive tours and expert content.
          </Text>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.features}>
            {FEATURES.map((f) => (
              <View key={f.title} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={f.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Choose your plan</Text>
          <View style={styles.plans}>
            {PLANS.map((p) => {
              const active = plan === p.id;
              return (
                <Pressable
                  key={p.id}
                  style={[styles.plan, active && styles.planActive]}
                  onPress={() => setPlan(p.id)}
                >
                  {p.note ? (
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>{p.note}</Text>
                    </View>
                  ) : null}
                  <Text style={styles.planLabel}>{p.label}</Text>
                  <Text style={styles.planPrice}>{p.price}</Text>
                  <Text style={styles.planPer}>{p.per}</Text>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Button
            label="Start Premium"
            icon="diamond-outline"
            fullWidth
            onPress={() => navigation.goBack()}
            style={styles.cta}
          />
          <Text style={styles.disclaimer}>Cancel anytime. Terms apply.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingBottom: 40 },
    hero: {
      paddingTop: 56,
      paddingBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
    },
    closeBtn: { position: 'absolute', top: 52, right: spacing.lg, padding: 4 },
    crown: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: 'rgba(245,166,35,0.16)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: 'rgba(245,166,35,0.3)',
    },
    heroTitle: { ...typography.h1, color: colors.white, textAlign: 'center' },
    heroSub: {
      ...typography.body,
      color: 'rgba(255,255,255,0.75)',
      textAlign: 'center',
      marginTop: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    body: { paddingHorizontal: spacing.lg, gap: spacing.lg },
    features: { gap: spacing.md, marginTop: spacing.md },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    featureIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureText: { flex: 1 },
    featureTitle: { ...typography.bodyBold, color: colors.textPrimary },
    featureDesc: { ...typography.caption, color: colors.textMuted, marginTop: 2, lineHeight: 16 },
    sectionTitle: { ...typography.h3, color: colors.textPrimary },
    plans: { flexDirection: 'row', gap: spacing.md },
    plan: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1.5,
      borderColor: colors.border,
      padding: spacing.lg,
      alignItems: 'center',
      gap: 2,
    },
    planActive: { borderColor: colors.primary, backgroundColor: colors.primaryMuted },
    planBadge: {
      position: 'absolute',
      top: -10,
      backgroundColor: colors.accent,
      borderRadius: radius.full,
      paddingHorizontal: 10,
      paddingVertical: 2,
    },
    planBadgeText: { ...typography.label, color: colors.black, fontWeight: '800' },
    planLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '700' },
    planPrice: { ...typography.h2, color: colors.textPrimary },
    planPer: { ...typography.label, color: colors.textMuted },
    radio: {
      marginTop: spacing.sm,
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    cta: { marginTop: spacing.sm },
    disclaimer: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  });
