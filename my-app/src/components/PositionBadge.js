import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { POSITIONS } from '../constants';
import { borderRadius, fontSize, fontWeight, spacing } from '../theme';

export function PositionBadge({ position, size = 'md' }) {
  const config = POSITIONS[position] || { shortLabel: '???', color: '#888' };
  return (
    <View style={[styles.badge, size === 'sm' && styles.badgeSm, { backgroundColor: config.color + '20', borderColor: config.color + '40' }]}>
      <Text style={[styles.text, size === 'sm' && styles.textSm, { color: config.color }]}>{config.shortLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.sm, borderWidth: 1, alignSelf: 'flex-start' },
  badgeSm: { paddingHorizontal: spacing.xs, paddingVertical: 2 },
  text: { fontSize: fontSize.xs, fontWeight: fontWeight.bold, letterSpacing: 0.5 },
  textSm: { fontSize: 10 },
});
