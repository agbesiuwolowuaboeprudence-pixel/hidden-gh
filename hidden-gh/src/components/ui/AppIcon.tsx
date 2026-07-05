import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { radius, useTheme } from '../../theme';

type IconName = keyof typeof Ionicons.glyphMap;

interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
  backgroundColor?: string;
  padded?: boolean;
}

export function AppIcon({
  name,
  size = 22,
  color,
  style,
  backgroundColor,
  padded = false,
}: AppIconProps) {
  const { colors } = useTheme();
  const icon = <Ionicons name={name} size={size} color={color ?? colors.textSecondary} />;

  if (backgroundColor || padded) {
    return (
      <View
        style={[
          styles.wrap,
          backgroundColor ? { backgroundColor } : null,
          padded ? styles.padded : null,
          style,
        ]}
      >
        {icon}
      </View>
    );
  }

  return icon;
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  padded: {
    width: 40,
    height: 40,
  },
});

export type { IconName };
