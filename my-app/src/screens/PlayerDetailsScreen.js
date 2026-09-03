import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react-native';
import { useAppContext } from '../hooks/AppContext';
import { Avatar } from '../components/Avatar';
import { PositionBadge } from '../components/PositionBadge';
import { AttributeBar } from '../components/AttributeBar';
import { Button } from '../components/Button';
import { ATTRIBUTES } from '../constants';
import { colors, spacing, borderRadius, fontSize, fontWeight, getOverallColor } from '../theme';

export default function PlayerDetailsScreen({ navigation, route }) {
  const { getPlayerById, deletePlayer, lineups } = useAppContext();
  const { playerId } = route.params;
  const player = getPlayerById(playerId);

  if (!player) return (
    <SafeAreaView style={styles.safe}><View style={styles.center}>
      <Text style={styles.notFound}>Jogador não encontrado</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View></SafeAreaView>
  );

  const usedInLineups = lineups.filter((l) => l.players.some((lp) => lp.playerId === playerId));
  const handleDelete = () => {
    const msg = usedInLineups.length > 0
      ? `Este jogador está em ${usedInLineups.length} escalação(ões). Deseja excluí-lo?`
      : 'Essa ação não pode ser desfeita.';
    Alert.alert('Excluir jogador?', msg, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await deletePlayer(playerId); navigation.goBack(); } },
    ]);
  };
  const oc = getOverallColor(player.overall);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><ArrowLeft size={22} color={colors.textPrimary} /></TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{player.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PlayerForm', { playerId })} style={styles.editBtn}><Edit3 size={18} color={colors.primary} /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.playerCard}>
          <Avatar name={player.name} imageUri={player.imageUri} size={80} />
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{player.name}</Text>
            {player.nickname && <Text style={styles.playerNickname}>{player.nickname}</Text>}
            <View style={styles.badgesRow}>
              <PositionBadge position={player.position} />
              {player.number != null && <View style={styles.numberBadge}><Text style={styles.numberText}>#{player.number}</Text></View>}
            </View>
          </View>
          <View style={styles.overallContainer}>
            <Text style={[styles.overallValue, { color: oc }]}>{player.overall}</Text>
            <Text style={styles.overallLabel}>Overall</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atributos</Text>
          <View style={styles.attributesCard}>
            {ATTRIBUTES.map((attr) => <AttributeBar key={attr.key} label={attr.label} value={player.attributes[attr.key]} />)}
          </View>
        </View>
        <View style={styles.actions}>
          <Button title="Editar" onPress={() => navigation.navigate('PlayerForm', { playerId })} variant="secondary" icon={<Edit3 size={16} color={colors.textPrimary} />} style={{ flex: 1 }} />
          <Button title="Excluir" onPress={handleDelete} variant="danger" icon={<Trash2 size={16} color="#fff" />} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  notFound: { color: colors.textSecondary, fontSize: fontSize.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, textAlign: 'center' },
  editBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl * 2, gap: spacing.xl },
  playerCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.xxl, flexDirection: 'row', alignItems: 'center', gap: spacing.lg, borderWidth: 1, borderColor: colors.border },
  playerInfo: { flex: 1, gap: spacing.xs },
  playerName: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textPrimary },
  playerNickname: { fontSize: fontSize.sm, color: colors.textSecondary },
  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  numberBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm, backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border },
  numberText: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: fontWeight.medium },
  overallContainer: { alignItems: 'center' },
  overallValue: { fontSize: fontSize.xxxl, fontWeight: fontWeight.extrabold },
  overallLabel: { fontSize: fontSize.xs, color: colors.textMuted },
  section: { gap: spacing.md },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary },
  attributesCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.xl, gap: spacing.lg, borderWidth: 1, borderColor: colors.border },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
});
