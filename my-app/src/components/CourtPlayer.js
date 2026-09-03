import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import { getOverallColor } from '../theme';
import { POSITIONS } from '../constants';
import { borderRadius, fontSize, fontWeight } from '../theme';

export const CourtPlayer = memo(function CourtPlayer({ player, position, onPress }) {
  const color = getOverallColor(player.overall);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
      <View style={[styles.avatarWrap, { borderColor: color }]}>
        <Avatar name={player.name} imageUri={player.imageUri} size={48} />
      </View>
      <View style={[styles.overallBadge, { backgroundColor: color }]}>
        <Text style={styles.overallText}>{player.overall}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>{player.name}</Text>
      <Text style={[styles.position, { color: POSITIONS[position]?.color || '#888' }]}>
        {POSITIONS[position]?.shortLabel || '???'}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: 72 },
  avatarWrap: { borderWidth: 2, borderRadius: 28, padding: 1 },
  overallBadge: { position: 'absolute', top: -4, right: 8, paddingHorizontal: 4, paddingVertical: 1, borderRadius: borderRadius.sm, minWidth: 22, alignItems: 'center' },
  overallText: { fontSize: 10, fontWeight: fontWeight.bold, color: '#fff' },
  name: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: '#fff', marginTop: 2, textAlign: 'center', maxWidth: 72 },
  position: { fontSize: 10, fontWeight: fontWeight.bold, letterSpacing: 0.5 },
});
