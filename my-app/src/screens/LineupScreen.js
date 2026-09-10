import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, Trash2 } from 'lucide-react-native';
import { useAppContext } from '../hooks/AppContext';
import { FutsalCourt, FormationSelector, PlayerSelector, Button } from '../components';
import { POSITIONS, FORMATIONS, DEFAULT_LINEUP_NAME } from '../constants';
import { generateId } from '../utils';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

export default function LineupScreen({ navigation, route }) {
  const { players, addLineup, updateLineup, deleteLineup, getLineupById } = useAppContext();
  const editingLineupId = route.params?.lineupId;
  const isEditing = Boolean(editingLineupId);

  const [lineupName, setLineupName] = useState(DEFAULT_LINEUP_NAME);
  const [formationId, setFormationId] = useState('3-1');
  const [lineupPlayers, setLineupPlayers] = useState([]);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState(null);
  const [saving, setSaving] = useState(false);

  const formation = FORMATIONS.find((f) => f.id === formationId) || FORMATIONS[0];
  const usedPlayerIds = lineupPlayers.map((lp) => lp.playerId);

  useEffect(() => {
    if (isEditing) {
      const existing = getLineupById(editingLineupId);
      if (existing) {
        setLineupName(existing.name);
        setFormationId(existing.formation);
        setLineupPlayers(existing.players || []);
      }
    }
  }, [editingLineupId, isEditing, getLineupById]);

  const handleSelectPlayer = useCallback((player) => {
    if (!selectorPosition) return;
    setLineupPlayers((prev) => {
      const remaining = prev.filter((lp) => lp.position !== selectorPosition);
      const posDef = formation.positions.find((p) => p.position === selectorPosition);
      return [
        ...remaining,
        {
          playerId: player.id,
          position: selectorPosition,
          x: posDef?.x || 0.5,
          y: posDef?.y || 0.5,
        },
      ];
    });
  }, [selectorPosition, formation]);

  const handlePlayerPress = useCallback((position, player) => {
    Alert.alert(player.name, `Posição: ${POSITIONS[position]?.label || position}`, [
      { text: 'Trocar jogador', onPress: () => { setSelectorPosition(position); setSelectorVisible(true); } },
      { text: 'Ver jogador', onPress: () => navigation.navigate('PlayerDetails', { playerId: player.id }) },
      { text: 'Remover', style: 'destructive', onPress: () => setLineupPlayers((prev) => prev.filter((lp) => lp.position !== position)) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }, [navigation]);

  const handleEmptyPress = useCallback((position) => {
    setSelectorPosition(position);
    setSelectorVisible(true);
  }, []);

  const handleFormationChange = useCallback((newId) => {
    const nextFormation = FORMATIONS.find((f) => f.id === newId);
    if (!nextFormation) return;
    setFormationId(newId);
    setLineupPlayers((prev) =>
      prev.map((lp) => {
        const posDef = nextFormation.positions.find((p) => p.position === lp.position);
        return posDef ? { ...lp, x: posDef.x, y: posDef.y } : lp;
      })
    );
  }, []);

  const handleSave = async () => {
    if (!lineupName.trim()) {
      Alert.alert('Atenção', 'Dê um nome à sua escalação.');
      return;
    }
    setSaving(true);
    const now = new Date().toISOString();
    const data = {
      id: isEditing ? editingLineupId : generateId(),
      name: lineupName.trim(),
      formation: formationId,
      players: lineupPlayers,
      createdAt: isEditing ? (getLineupById(editingLineupId)?.createdAt || now) : now,
      updatedAt: now,
    };

    if (isEditing) {
      await updateLineup(data);
    } else {
      await addLineup(data);
    }
    setSaving(false);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Excluir escalação?', 'Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteLineup(editingLineupId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar escalação' : 'Nova escalação'}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.iconBtn}>
          <Save size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={styles.nameInput}
          value={lineupName}
          onChangeText={setLineupName}
          placeholder="Nome da escalação"
          placeholderTextColor={colors.textMuted}
        />

        <View style={styles.counterRow}>
          <Text style={[styles.counter, lineupPlayers.length === 5 && styles.counterComplete]}>
            {lineupPlayers.length}/5 jogadores
          </Text>
          {lineupPlayers.length < 5 && <Text style={styles.incomplete}>Escalação incompleta</Text>}
        </View>

        <FormationSelector selectedFormationId={formationId} onSelect={handleFormationChange} />

        <View style={styles.courtSection}>
          <FutsalCourt
            formation={formation}
            lineupPlayers={lineupPlayers}
            players={players}
            onPlayerPress={handlePlayerPress}
            onEmptyPress={handleEmptyPress}
          />
        </View>

        <Button
          title={isEditing ? 'Salvar alterações' : 'Salvar escalação'}
          onPress={handleSave}
          loading={saving}
          size="lg"
        />

        {isEditing && (
          <Button
            title="Excluir escalação"
            onPress={handleDelete}
            variant="danger"
            size="md"
            icon={<Trash2 size={16} color="#fff" />}
          />
        )}
      </ScrollView>

      <PlayerSelector
        visible={selectorVisible}
        onClose={() => setSelectorVisible(false)}
        onSelect={handleSelectPlayer}
        players={players}
        currentPosition={selectorPosition}
        usedPlayerIds={usedPlayerIds}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl * 3, gap: spacing.lg },
  nameInput: { backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontSize: fontSize.lg, color: colors.textPrimary, fontWeight: fontWeight.semibold, borderWidth: 1, borderColor: colors.border },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  counter: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.warning },
  counterComplete: { color: colors.primary },
  incomplete: { fontSize: fontSize.xs, color: colors.textMuted },
  courtSection: { alignItems: 'center', marginVertical: spacing.md },
});
