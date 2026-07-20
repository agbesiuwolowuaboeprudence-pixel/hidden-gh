import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { typography, useTheme, type Palette } from '../../theme';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}

export function RatingStars({
  rating,
  size = 14,
  showValue = true,
  reviewCount,
}: RatingStarsProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= Math.floor(rating) ? 'star' : star <= rating ? 'star-half' : 'star-outline'}
          size={size}
          color={colors.accent}
        />
      ))}
      {showValue ? <Text style={styles.value}>{rating.toFixed(1)}</Text> : null}
      {reviewCount !== undefined ? (
        <Text style={styles.reviews}>({reviewCount.toLocaleString()})</Text>
      ) : null}
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    value: {
      ...typography.caption,
      color: c.textPrimary,
      fontWeight: '700',
      marginLeft: 4,
    },
    reviews: {
      ...typography.caption,
      color: c.textMuted,
      marginLeft: 2,
    },
  });
