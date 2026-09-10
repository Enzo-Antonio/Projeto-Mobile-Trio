import React from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { CourtPlayer } from './CourtPlayer';
import { borderRadius, shadows } from '../theme';

export function FutsalCourt({ formation, lineupPlayers, players, onPlayerPress, onEmptyPress }) {
  const { width } = useWindowDimensions();
  const courtWidth = Math.min(width - 32, 400);
  const courtHeight = courtWidth * 1.5;

  return (
    <View style={[styles.wrapper, { width: courtWidth, height: courtHeight }]}>
      <View style={[styles.court, { width: courtWidth, height: courtHeight }]}>
        <View style={styles.borderLine} />
        <View style={styles.centerLine} />
        <View style={styles.centerCircle} />
        <View style={styles.goalAreaTop} />
        <View style={styles.goalAreaBottom} />
        <View style={styles.penaltyAreaTop} />
        <View style={styles.penaltyAreaBottom} />
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
        <View style={styles.goalTop} />
        <View style={styles.goalBottom} />
      </View>

      {formation.positions.map((pos) => {
        const lp = lineupPlayers.find((p) => p.position === pos.position);
        const playerData = lp ? players.find((p) => p.id === lp.playerId) : null;
        return (
          <View
            key={pos.position}
            style={[styles.slot, { left: pos.x * courtWidth - 36, top: pos.y * courtHeight - 36 }]}
          >
            {playerData ? (
              <CourtPlayer
                player={playerData}
                position={pos.position}
                onPress={() => onPlayerPress(pos.position, playerData)}
              />
            ) : (
              <TouchableOpacity
                style={styles.empty}
                onPress={() => onEmptyPress(pos.position)}
                activeOpacity={0.7}
              >
                <View style={styles.plusH} />
                <View style={styles.plusV} />
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: 'center', borderRadius: borderRadius.lg, overflow: 'hidden', ...shadows.lg },
  court: { backgroundColor: '#1B5E20', borderRadius: borderRadius.lg },
  borderLine: { position: 'absolute', top: 6, left: 6, right: 6, bottom: 6, borderWidth: 2, borderColor: 'rgba(255,255,255,0.7)', borderRadius: 8 },
  centerLine: { position: 'absolute', top: '50%', left: 6, right: 6, height: 1, backgroundColor: 'rgba(255,255,255,0.5)' },
  centerCircle: { position: 'absolute', top: '50%', left: '50%', width: 60, height: 60, marginLeft: -30, marginTop: -30, borderRadius: 30, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  goalAreaTop: { position: 'absolute', top: 6, left: '25%', right: '25%', height: 40, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, borderWidth: 2, borderTopWidth: 0, borderColor: 'rgba(255,255,255,0.5)' },
  goalAreaBottom: { position: 'absolute', bottom: 6, left: '25%', right: '25%', height: 40, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 2, borderBottomWidth: 0, borderColor: 'rgba(255,255,255,0.5)' },
  penaltyAreaTop: { position: 'absolute', top: 6, left: '15%', right: '15%', height: 70, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderWidth: 1.5, borderTopWidth: 0, borderColor: 'rgba(255,255,255,0.25)' },
  penaltyAreaBottom: { position: 'absolute', bottom: 6, left: '15%', right: '15%', height: 70, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderWidth: 1.5, borderBottomWidth: 0, borderColor: 'rgba(255,255,255,0.25)' },
  corner: { position: 'absolute', width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
  cornerTL: { top: 6, left: 6, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 6, right: 6, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 6, left: 6, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 6, right: 6, borderLeftWidth: 0, borderTopWidth: 0 },
  goalTop: { position: 'absolute', top: -6, left: '35%', right: '35%', height: 6, backgroundColor: 'rgba(255,255,255,0.3)' },
  goalBottom: { position: 'absolute', bottom: -6, left: '35%', right: '35%', height: 6, backgroundColor: 'rgba(255,255,255,0.3)' },
  slot: { position: 'absolute', width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  empty: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  plusH: { position: 'absolute', width: 18, height: 2, backgroundColor: 'rgba(255,255,255,0.5)' },
  plusV: { position: 'absolute', width: 2, height: 18, backgroundColor: 'rgba(255,255,255,0.5)' },
});
