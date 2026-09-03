import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

export function Button({ title, onPress, variant = 'primary', size = 'md', loading = false, disabled = false, icon, style }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.7}
      style={[styles.base, styles[variant], styles[`size_${size}`], (disabled || loading) && styles.disabled, style]}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} size="small" />
      ) : (
        <>{icon}<Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`]]}>{title}</Text></>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: borderRadius.md, gap: spacing.sm },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: colors.error },
  ghost: { backgroundColor: 'transparent' },
  size_sm: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  size_md: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  size_lg: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  disabled: { opacity: 0.5 },
  text: { fontWeight: fontWeight.semibold },
  text_primary: { color: '#fff' }, text_secondary: { color: colors.textPrimary },
  text_danger: { color: '#fff' }, text_ghost: { color: colors.primary },
  textSize_sm: { fontSize: fontSize.sm }, textSize_md: { fontSize: fontSize.md }, textSize_lg: { fontSize: fontSize.lg },
});
