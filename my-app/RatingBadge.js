import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { borderRadius, fontSize, fontWeight, spacing } from '../theme';
import { getOverallColor, getOverallBackgroundColor } from '../theme';

export function RatingBadge({ rating, size = 'md' }) {
  const color = getOverallColor(rating);
  return (
    <View style={[styles.badge, { backgroundColor: getOverallBackgroundColor(rating), borderColor: color + '40' }, styles[`size_${size}`]]}>
      <Text style={[styles.text, { color }, styles[`text_${size}`]]}>{rating}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: 'center', justifyContent: 'center', borderRadius: borderRadius.sm, borderWidth: 1 },
  size_sm: { minWidth: 30, paddingHorizontal: spacing.xs, paddingVertical: 2 },
  size_md: { minWidth: 36, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  size_lg: { minWidth: 44, paddingHorizontal: spacing.md, paddingVertical: 5 },
  text: { fontWeight: fontWeight.bold },
  text_sm: { fontSize: fontSize.xs }, text_md: { fontSize: fontSize.sm }, text_lg: { fontSize: fontSize.lg },
});
