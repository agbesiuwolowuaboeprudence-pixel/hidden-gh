import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';

import { radius, typography, useTheme, type Palette } from '../../theme';
import type { IconName } from './AppIcon';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  style,
  fullWidth = false,
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const textColor = styles[`text_${variant}`].color as string;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon ? (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 16 : 18}
              color={textColor}
              style={styles.icon}
            />
          ) : null}
          <Text style={[styles[`text_${variant}`], styles[`textSize_${size}`]]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.lg,
      gap: 6,
    },
    fullWidth: { width: '100%' },
    disabled: { opacity: 0.5 },
    pressed: { opacity: 0.85 },
    primary: { backgroundColor: c.primary },
    secondary: { backgroundColor: c.primaryMuted },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: c.primary,
    },
    ghost: { backgroundColor: c.surfaceElevated },
    danger: { backgroundColor: c.dangerMuted },
    size_sm: { paddingHorizontal: 14, paddingVertical: 8 },
    size_md: { paddingHorizontal: 18, paddingVertical: 12 },
    size_lg: { paddingHorizontal: 24, paddingVertical: 14 },
    icon: { marginRight: 2 },
    text_primary: { ...typography.bodyBold, color: c.white },
    text_secondary: { ...typography.bodyBold, color: c.primary },
    text_outline: { ...typography.bodyBold, color: c.primary },
    text_ghost: { ...typography.bodyBold, color: c.textSecondary },
    text_danger: { ...typography.bodyBold, color: c.danger },
    textSize_sm: { fontSize: 12 },
    textSize_md: { fontSize: 14 },
    textSize_lg: { fontSize: 15 },
  });
