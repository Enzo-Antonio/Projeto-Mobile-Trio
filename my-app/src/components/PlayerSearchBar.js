import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors, spacing, borderRadius, fontSize } from '../theme';

export function PlayerSearchBar({ value, onChangeText, placeholder = 'Buscar jogador...' }) {
  return (
    <View style={styles.container}>
      <Search size={18} color={colors.textMuted} style={styles.icon} />
      <TextInput style={styles.input} value={value} onChangeText={onChangeText}
        placeholder={placeholder} placeholderTextColor={colors.textMuted} autoCapitalize="none" autoCorrect={false} />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clear}>
          <X size={16} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border },
  icon: { marginRight: spacing.sm },
  input: { flex: 1, paddingVertical: spacing.md, fontSize: fontSize.md, color: colors.textPrimary },
  clear: { padding: spacing.xs },
});
