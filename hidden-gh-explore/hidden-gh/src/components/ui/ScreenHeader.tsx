import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { spacing, typography, useTheme, type Palette } from '../../theme';
import type { IconName } from './AppIcon';
import { Button } from './Button';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: { label: string; onPress: () => void; icon?: IconName };
  style?: ViewStyle;
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightAction,
  style,
}: ScreenHeaderProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={[styles.header, style]}>
      <View style={styles.left}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
        ) : null}
        <View style={styles.titles}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightAction ? (
        <Button
          label={rightAction.label}
          onPress={rightAction.onPress}
          variant="primary"
          size="sm"
          icon={rightAction.icon}
        />
      ) : null}
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: 54,
      paddingBottom: spacing.md,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: spacing.sm,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: c.border,
    },
    titles: { flex: 1 },
    title: { ...typography.h2, color: c.textPrimary },
    subtitle: { ...typography.caption, color: c.textMuted, marginTop: 2 },
  });

interface EmptyStateProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createEmptyStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={36} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.btn} />
      ) : null}
    </View>
  );
}

const createEmptyStyles = (c: Palette) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
      paddingHorizontal: spacing.xl,
      gap: spacing.sm,
    },
    iconWrap: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: c.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    title: { ...typography.h3, color: c.textPrimary, textAlign: 'center' },
    subtitle: {
      ...typography.body,
      color: c.textMuted,
      textAlign: 'center',
    },
    btn: { marginTop: spacing.md },
  });
