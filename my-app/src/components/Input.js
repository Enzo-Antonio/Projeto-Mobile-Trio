import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

export function Input({ label, value, onChangeText, placeholder, keyboardType = 'default', error, style, multiline = false, numberOfLines = 1 }) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={[styles.input, multiline && { height: numberOfLines * 24 + 24, textAlignVertical: 'top' }, error && styles.inputError]}
        value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType} multiline={multiline} numberOfLines={numberOfLines} autoCapitalize="none" autoCorrect={false} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSecondary },
  input: { backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontSize: fontSize.md, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  inputError: { borderColor: colors.error },
  error: { fontSize: fontSize.xs, color: colors.error },
});
