import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fontWeight } from '../theme';
import { getPlayerInitials } from '../utils';

export function Avatar({ name, imageUri, size = 48 }) {
  if (imageUri) {
    return <Image source={{ uri: imageUri }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.surfaceLight }} />;
  }
  return (
    <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{getPlayerInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  initials: { color: colors.primary, fontWeight: fontWeight.bold },
});
