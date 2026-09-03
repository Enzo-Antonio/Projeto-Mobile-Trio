import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import { PositionBadge } from './PositionBadge';
import { RatingBadge } from './RatingBadge';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

export const PlayerListItem = memo(function PlayerListItem({ player, onPress, disabled = false }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.7}
      style={[styles.container, disabled && styles.disabled]}>
      <Avatar name={player.name} imageUri={player.imageUri} size={44} />
      <Text style={styles.name} numberOfLines={1}>{player.name}</Text>
      <PositionBadge position={player.position} size="sm" />
      {player.number != null && <Text style={styles.number}>#{player.number}</Text>}
      <RatingBadge rating={player.overall} size="sm" />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, gap: spacing.md, borderWidth: 1, borderColor: colors.border },
  disabled: { opacity: 0.4 },
  name: { flex: 1, fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  number: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: fontWeight.medium },
});
