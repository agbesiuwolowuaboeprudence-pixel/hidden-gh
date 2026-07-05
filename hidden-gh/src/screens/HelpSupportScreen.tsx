import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { ScreenHeader } from '../components/ui/ScreenHeader';
import { radius, spacing, typography, useTheme, type Palette } from '../theme';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'HelpSupport'>;

const FAQS = [
  {
    q: 'How do I book a tour guide?',
    a: 'Open Explore, switch to the Guides tab, choose a guide and tap Book. You can review the guide before confirming.',
  },
  {
    q: 'What does Premium include?',
    a: 'Premium unlocks in-depth history, audio guides, 3D & VR tours, offline access and member discounts on guides and hotels.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Yes. Go to My Trips, open the booking and choose Cancel. Refunds follow the guide or hotel policy.',
  },
  {
    q: 'Do I need internet on site?',
    a: 'Premium members can download sites and maps for offline use before travelling.',
  },
];

const CONTACTS: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }[] = [
  { icon: 'mail-outline', label: 'Email us', value: 'support@hiddenghana.com' },
  { icon: 'call-outline', label: 'Call us', value: '+233 30 000 0000' },
  { icon: 'chatbubbles-outline', label: 'Live chat', value: 'Mon–Fri, 9am–6pm GMT' },
];

export default function HelpSupportScreen({ navigation }: Props) {
  const { colors, scheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScreenHeader title="Help & Support" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Frequently asked</Text>
        <View style={styles.faqCard}>
          {FAQS.map((f, i) => {
            const expanded = open === i;
            return (
              <View key={f.q}>
                {i > 0 ? <View style={styles.divider} /> : null}
                <Pressable style={styles.faqRow} onPress={() => setOpen(expanded ? null : i)}>
                  <Text style={styles.faqQ}>{f.q}</Text>
                  <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.textMuted}
                  />
                </Pressable>
                {expanded ? <Text style={styles.faqA}>{f.a}</Text> : null}
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Get in touch</Text>
        <View style={styles.contacts}>
          {CONTACTS.map((c) => (
            <Pressable key={c.label} style={styles.contactRow}>
              <View style={styles.contactIcon}>
                <Ionicons name={c.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>{c.label}</Text>
                <Text style={styles.contactValue}>{c.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingHorizontal: spacing.lg, paddingBottom: 40, gap: spacing.md },
    sectionTitle: { ...typography.h3, color: colors.textPrimary, marginTop: spacing.sm },
    faqCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
    },
    divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
    faqRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    faqQ: { ...typography.bodyBold, color: colors.textPrimary, flex: 1 },
    faqA: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 20,
      paddingBottom: spacing.md,
    },
    contacts: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
    },
    contactIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contactText: { flex: 1 },
    contactLabel: { ...typography.bodyBold, color: colors.textPrimary },
    contactValue: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  });
