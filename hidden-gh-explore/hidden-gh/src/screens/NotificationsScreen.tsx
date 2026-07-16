import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../components/ui/ScreenHeader';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { radius, spacing, typography, useTheme, type Palette } from '../theme';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'Notifications'>;

type NotifType = 'booking' | 'promo' | 'system';

interface Notif {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const NOTIFICATIONS: Notif[] = [
  {
    id: 'n1',
    type: 'booking',
    title: 'Booking confirmed',
    body: 'Your tour with Abena Mensah at Kwame Nkrumah Memorial is confirmed.',
    time: '2h ago',
    unread: true,
  },
  {
    id: 'n2',
    type: 'promo',
    title: 'Premium is 33% off',
    body: 'Unlock 3D & VR tours and offline access with the yearly plan.',
    time: '1d ago',
    unread: true,
  },
  {
    id: 'n3',
    type: 'system',
    title: 'New sites added',
    body: '5 new destinations in the Volta Region are now available to explore.',
    time: '3d ago',
    unread: false,
  },
];

const TYPE_ICON: Record<NotifType, keyof typeof Ionicons.glyphMap> = {
  booking: 'checkmark-circle',
  promo: 'diamond',
  system: 'information-circle',
};

export default function NotificationsScreen({ navigation }: Props) {
  const { colors, scheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [items, setItems] = useState(NOTIFICATIONS);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScreenHeader
        title="Notifications"
        onBack={() => navigation.goBack()}
        rightAction={items.length > 0 ? { label: 'Clear', onPress: () => setItems([]) } : undefined}
      />
      {items.length === 0 ? (
        <EmptyState
          icon="notifications-off-outline"
          title="You're all caught up"
          subtitle="New booking updates and offers will appear here."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {items.map((n) => (
            <View key={n.id} style={[styles.card, n.unread && styles.cardUnread]}>
              <View style={styles.iconWrap}>
                <Ionicons name={TYPE_ICON[n.type]} size={20} color={colors.primary} />
              </View>
              <View style={styles.body}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{n.title}</Text>
                  {n.unread ? <View style={styles.dot} /> : null}
                </View>
                <Text style={styles.text}>{n.body}</Text>
                <Text style={styles.time}>{n.time}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    list: { paddingHorizontal: spacing.lg, paddingBottom: 40, gap: spacing.md },
    card: {
      flexDirection: 'row',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
    },
    cardUnread: { borderColor: colors.primary },
    iconWrap: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: { flex: 1, gap: 3 },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { ...typography.bodyBold, color: colors.textPrimary },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
    text: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
    time: { ...typography.label, color: colors.textMuted, marginTop: 2 },
  });
