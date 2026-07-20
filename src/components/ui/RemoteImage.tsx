import { Image, StyleProp, Text, View } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/src/theme';

interface RemoteImageProps {
  uri?: string;
  style?: StyleProp<any>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  /** Short label shown on the placeholder when the image fails to load. */
  fallbackLabel?: string;
}

/**
 * Drop-in replacement for <Image source={{ uri }} /> that renders a themed
 * placeholder instead of a broken box when the remote URL fails.
 */
export function RemoteImage({ uri, style, resizeMode = 'cover', fallbackLabel }: RemoteImageProps) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <View
        style={[
          style,
          {
            backgroundColor: colors.primaryMuted,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>
          {fallbackLabel ?? 'Hidden Ghana'}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode={resizeMode}
      onError={() => setFailed(true)}
    />
  );
}
