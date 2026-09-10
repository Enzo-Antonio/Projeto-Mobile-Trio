import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Trophy, Plus, Swords } from 'lucide-react-native';
import { useAppContext } from '../hooks/AppContext';
import { Card, Button } from '../components';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';

export default function HomeScreen({ navigation }) {
  const { players, lineups, isLoading } = useAppContext();

  const stats = [
    {
      Icon: Users,
      color: colors.primary,
      value: players.length,
      label: players.length === 1 ? 'jogador cadastrado' : 'jogadores cadastrados',
      tab: 'PlayersTab',
    },
    {
      Icon: Trophy,
      color: colors.warning,
      value: lineups.length,
      label: lineups.length === 1 ? 'escalação salva' : 'escalações salvas',
      tab: 'LineupTab',
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Swords size={28} color={colors.primary} />
            <View>
              <Text style={styles.title}>Meu Futsal</Text>
              <Text style={styles.subtitle}>Monte sua escalação</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => navigation.navigate('LineupTab', { screen: 'LineupBuilder' })}
          activeOpacity={0.7}
        >
          <View style={styles.primaryActionContent}>
            <View style={styles.primaryActionIcon}><Plus size={24} color="#fff" /></View>
            <View style={styles.primaryActionText}>
              <Text style={styles.primaryActionTitle}>Nova escalação</Text>
              <Text style={styles.primaryActionSubtitle}>Monte seu time em segundos</Text>
            </View>
          </View>
        </TouchableOpacity>

        {stats.map(({ Icon, color, value, label, tab }) => (
          <TouchableOpacity
            key={tab}
            style={styles.statCard}
            onPress={() => navigation.navigate(tab)}
            activeOpacity={0.7}
          >
            <View style={styles.statIcon}><Icon size={22} color={color} /></View>
            <View style={styles.statInfo}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {players.length === 0 && !isLoading && (
          <Card style={styles.hintCard}>
            <Text style={styles.hintTitle}>Comece cadastrando jogadores</Text>
            <Text style={styles.hintText}>Cadastre seus jogadores para começar a montar sua equipe.</Text>
            <Button title="Cadastrar jogadores" onPress={() => navigation.navigate('PlayersTab')} variant="secondary" size="sm" />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl * 2 },
  header: { marginBottom: spacing.xxl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { fontSize: fontSize.xxxl, fontWeight: fontWeight.extrabold, color: colors.textPrimary },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary },
  primaryAction: { backgroundColor: colors.primary, borderRadius: borderRadius.xl, padding: spacing.xl, marginBottom: spacing.lg, ...shadows.md },
  primaryActionContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  primaryActionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  primaryActionText: { flex: 1 },
  primaryActionTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: '#fff' },
  primaryActionSubtitle: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  statCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.xl, gap: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  statIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  statInfo: { flex: 1 },
  statValue: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.textPrimary },
  statLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
  hintCard: { marginTop: spacing.lg, gap: spacing.sm },
  hintTitle: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  hintText: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
});
