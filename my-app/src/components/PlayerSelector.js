import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { X, Users } from 'lucide-react-native';
import { PlayerListItem } from './PlayerListItem';
import { PlayerSearchBar } from './PlayerSearchBar';
import { EmptyState } from './EmptyState';
import { POSITIONS } from '../constants';
import { searchPlayers } from '../utils';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

export function PlayerSelector({ visible, onClose, onSelect, players, currentPosition, usedPlayerIds }) {
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const posConfig = POSITIONS[currentPosition] || { label: 'Posição', shortLabel: '???' };

  const filteredPlayers = useMemo(() => {
    let list = players;
    if (!showAll) {
      const compatible = list.filter((p) => p.position === currentPosition);
      if (compatible.length > 0) list = compatible;
    }
    return query.trim() ? searchPlayers(list, query) : list;
  }, [players, query, showAll, currentPosition]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Selecionar jogador</Text>
              <Text style={styles.subtitle}>Posição: {posConfig.label}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}><X size={22} color={colors.textSecondary} /></TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <PlayerSearchBar value={query} onChangeText={setQuery} />
          </View>
          <TouchableOpacity style={styles.toggleBtn} onPress={() => setShowAll(!showAll)}>
            <Text style={styles.toggleText}>{showAll ? 'Mostrar apenas ' + posConfig.shortLabel : 'Mostrar todos'}</Text>
          </TouchableOpacity>
          <FlatList data={filteredPlayers} keyExtractor={(item) => item.id} contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
            renderItem={({ item }) => (
              <PlayerListItem player={item} disabled={usedPlayerIds.includes(item.id)}
                onPress={() => { if (!usedPlayerIds.includes(item.id)) { onSelect(item); onClose(); } }} />
            )}
            ListEmptyComponent={<EmptyState icon={<Users size={32} color={colors.textMuted} />} title="Nenhum jogador encontrado" description="Cadastre jogadores primeiro." />} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, maxHeight: '85%', paddingBottom: spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.xl, paddingBottom: spacing.md },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textPrimary },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  closeBtn: { padding: spacing.sm },
  searchContainer: { paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  toggleBtn: { paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  toggleText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.semibold },
  list: { paddingHorizontal: spacing.xl },
});
