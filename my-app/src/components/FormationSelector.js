import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { FORMATIONS } from '../constants';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

export function FormationSelector({ selectedFormationId, onSelect }) {
  const [visible, setVisible] = useState(false);
  const selected = FORMATIONS.find((f) => f.id === selectedFormationId) || FORMATIONS[0];

  return (
    <View>
      <TouchableOpacity style={styles.selector} onPress={() => setVisible(true)} activeOpacity={0.7}>
        <Text style={styles.label}>Formação</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{selected.name}</Text>
          <ChevronDown size={16} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Escolher formação</Text>
            <FlatList data={FORMATIONS} keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.option, item.id === selectedFormationId && styles.optionActive]}
                  onPress={() => { onSelect(item.id); setVisible(false); }}>
                  <View style={styles.optionInfo}>
                    <Text style={[styles.optionName, item.id === selectedFormationId && styles.optionNameActive]}>{item.name}</Text>
                    <Text style={styles.optionLabel}>{item.label}</Text>
                  </View>
                  {item.id === selectedFormationId && <Check size={18} color={colors.primary} />}
                </TouchableOpacity>
              )} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border },
  label: { fontSize: fontSize.sm, color: colors.textMuted },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  value: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textPrimary },
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.xl, maxHeight: '60%' },
  sheetTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.lg },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.lg, paddingHorizontal: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.xs },
  optionActive: { backgroundColor: colors.primary + '15' },
  optionInfo: { gap: 2 },
  optionName: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  optionNameActive: { color: colors.primary },
  optionLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
});
