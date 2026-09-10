import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users, ArrowUpDown } from 'lucide-react-native';
import { useAppContext } from '../hooks/AppContext';
import { PlayerListItem, PlayerSearchBar, EmptyState } from '../components';
import { searchPlayers, sortPlayers } from '../utils';
import { SORT_OPTIONS } from '../constants';
import { colors, spacing, fontSize, fontWeight } from '../theme';

export default function PlayersScreen({ navigation }) {
  const { players } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  const filteredPlayers = useMemo(
    () => sortPlayers(searchPlayers(players, searchQuery), sortBy),
    [players, searchQuery, sortBy]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.listItem}>
        <PlayerListItem
          player={item}
          onPress={() => navigation.navigate('PlayerDetails', { playerId: item.id })}
        />
      </View>
    ),
    [navigation]
  );

  const currentSortLabel = SORT_OPTIONS.find((s) => s.key === sortBy)?.label || 'Nome';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Jogadores</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('PlayerForm', {})}
            activeOpacity={0.7}
          >
            <Plus size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <PlayerSearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        <View style={styles.sortRow}>
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortMenuVisible((prev) => !prev)}
          >
            <ArrowUpDown size={14} color={colors.textSecondary} />
            <Text style={styles.sortLabel}>{currentSortLabel}</Text>
          </TouchableOpacity>
        </View>

        {sortMenuVisible && (
          <View style={styles.sortMenu}>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.sortOption, sortBy === opt.key && styles.sortOptionActive]}
                onPress={() => {
                  setSortBy(opt.key);
                  setSortMenuVisible(false);
                }}
              >
                <Text style={[styles.sortOptionText, sortBy === opt.key && styles.sortOptionTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <FlatList
          data={filteredPlayers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <EmptyState
              icon={<Users size={40} color={colors.textMuted} />}
              title={searchQuery ? 'Nenhum jogador encontrado' : 'Nenhum jogador cadastrado'}
              description={searchQuery ? 'Tente buscar com outros termos.' : 'Adicione seu primeiro jogador para começar.'}
              actionLabel={!searchQuery ? '+ Adicionar jogador' : undefined}
              onAction={!searchQuery ? () => navigation.navigate('PlayerForm', {}) : undefined}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.extrabold, color: colors.textPrimary },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  searchContainer: { paddingHorizontal: spacing.xl, marginBottom: spacing.sm },
  sortRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.sm },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, backgroundColor: colors.surfaceLight, borderRadius: 8 },
  sortLabel: { fontSize: fontSize.xs, color: colors.textSecondary },
  sortMenu: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.xl, gap: spacing.xs, marginBottom: spacing.sm },
  sortOption: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderRadius: 8, backgroundColor: colors.surfaceLight },
  sortOptionActive: { backgroundColor: colors.primary + '20' },
  sortOptionText: { fontSize: fontSize.xs, color: colors.textSecondary },
  sortOptionTextActive: { color: colors.primary, fontWeight: fontWeight.semibold },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl * 2 },
  listItem: {},
  separator: { height: spacing.sm },
});
