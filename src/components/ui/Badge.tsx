import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, typography, useTheme, type Palette } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'premium' | 'success' | 'warning' | 'danger';
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={[styles.badge, styles[variant]]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{label}</Text>
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.full,
      alignSelf: 'flex-start',
    },
    default: { backgroundColor: c.primaryMuted },
    premium: { backgroundColor: c.premium },
    success: { backgroundColor: c.primaryMuted },
    warning: { backgroundColor: c.warning },
    danger: { backgroundColor: c.dangerMuted },
    text: { ...typography.label, fontWeight: '700' },
    text_default: { color: c.primary },
    text_premium: { color: c.black },
    text_success: { color: c.primary },
    text_warning: { color: c.accent },
    text_danger: { color: c.danger },
  });
