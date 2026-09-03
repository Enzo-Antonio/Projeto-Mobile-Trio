import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Plus, Copy, Trash2, Edit3 } from 'lucide-react-native';
import { useAppContext } from '../hooks/AppContext';
import { EmptyState } from '../components/EmptyState';
import { Card } from '../components/Card';
import { formatDate, generateId } from '../utils';
import { FORMATIONS } from '../constants';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

export default function SavedLineupsScreen({ navigation }) {
  const { lineups, deleteLineup, addLineup } = useAppContext();

  const handleDuplicate = useCallback(async (lineup) => {
    const now = new Date().toISOString();
    await addLineup({ ...lineup, id: generateId(), name: lineup.name + ' (cópia)', createdAt: now, updatedAt: now });
  }, [addLineup]);

  const handleDelete = useCallback((lineup) => {
    Alert.alert('Excluir escalação?', `Deseja excluir "${lineup.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteLineup(lineup.id) },
    ]);
  }, [deleteLineup]);

  const renderLineup = useCallback(({ item }) => {
    const formation = FORMATIONS.find((f) => f.id === item.formation);
    const playerCount = item.players?.length || 0;
    return (
      <Card style={styles.lineupCard}>
        <TouchableOpacity style={styles.lineupContent}
          onPress={() => navigation.navigate('LineupBuilder', { lineupId: item.id })} activeOpacity={0.7}>
          <View style={styles.miniCourt}>
            <View style={styles.miniCourtBg}>
              <View style={styles.miniCenterLine} /><View style={styles.miniCenterCircle} />
              {item.players?.map((lp) => {
                const fPos = formation?.positions.find((p) => p.position === lp.position);
                return fPos ? <View key={lp.position} style={[styles.miniDot, { left: fPos.x * 100 + '%', top: fPos.y * 100 + '%' }]} /> : null;
              })}
            </View>
          </View>
          <View style={styles.lineupInfo}>
            <Text style={styles.lineupName}>{item.name}</Text>
            <Text style={styles.lineupFormation}>{formation?.name || item.formation}</Text>
            <Text style={styles.lineupDate}>{formatDate(item.updatedAt)}</Text>
            <Text style={[styles.lineupCount, playerCount === 5 && styles.lineupCountComplete]}>{playerCount}/5 jogadores</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.lineupActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('LineupBuilder', { lineupId: item.id })}>
            <Edit3 size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDuplicate(item)}>
            <Copy size={16} color={colors.info} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item)}>
            <Trash2 size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </Card>
    );
  }, [navigation, handleDuplicate, handleDelete]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Minhas escalações</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('LineupBuilder')}>
            <Plus size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList data={lineups} keyExtractor={(item) => item.id} renderItem={renderLineup}
          contentContainerStyle={styles.list} ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListEmptyComponent={
            <EmptyState icon={<Trophy size={40} color={colors.textMuted} />}
              title="Nenhuma escalação salva" description="Crie sua primeira escalação."
              actionLabel="+ Nova escalação" onAction={() => navigation.navigate('LineupBuilder')} />
          } />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.extrabold, color: colors.textPrimary },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl * 2 },
  lineupCard: { padding: spacing.lg, gap: spacing.md },
  lineupContent: { flexDirection: 'row', gap: spacing.lg },
  miniCourt: { width: 70, height: 100, borderRadius: borderRadius.md, overflow: 'hidden', backgroundColor: '#1B5E20' },
  miniCourtBg: { flex: 1, position: 'relative' },
  miniCenterLine: { position: 'absolute', top: '50%', left: 2, right: 2, height: 0.5, backgroundColor: 'rgba(255,255,255,0.4)' },
  miniCenterCircle: { position: 'absolute', top: '50%', left: '50%', width: 16, height: 16, marginLeft: -8, marginTop: -8, borderRadius: 8, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.3)' },
  miniDot: { position: 'absolute', width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginLeft: -3, marginTop: -3 },
  lineupInfo: { flex: 1, gap: 2 },
  lineupName: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary },
  lineupFormation: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.semibold },
  lineupDate: { fontSize: fontSize.xs, color: colors.textMuted },
  lineupCount: { fontSize: fontSize.xs, color: colors.warning, marginTop: spacing.xs },
  lineupCountComplete: { color: colors.primary },
  lineupActions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },
  actionBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center' },
});
