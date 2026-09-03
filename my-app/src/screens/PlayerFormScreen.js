import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Check, Camera, X, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../hooks/AppContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { POSITIONS, ATTRIBUTES } from '../constants';
import { generateId, clampAttribute } from '../utils';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

const POSITION_LIST = Object.keys(POSITIONS);

export default function PlayerFormScreen({ navigation, route }) {
  const { addPlayer, updatePlayer, getPlayerById } = useAppContext();
  const editingId = route.params?.playerId;
  const isEditing = !!editingId;
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [number, setNumber] = useState('');
  const [position, setPosition] = useState('FIXO');
  const [overall, setOverall] = useState('70');
  const [imageUri, setImageUri] = useState(null);
  const [attributes, setAttributes] = useState({ speed: 70, shooting: 70, stamina: 70, passing: 70, dribbling: 70, defending: 70 });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [posModalVisible, setPosModalVisible] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const player = getPlayerById(editingId);
      if (player) {
        setName(player.name); setNickname(player.nickname || ''); setNumber(player.number?.toString() || '');
        setPosition(player.position); setOverall(player.overall.toString()); setImageUri(player.imageUri || null);
        setAttributes(player.attributes);
      }
    }
  }, [editingId]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!result.canceled && result.assets[0]) setImageUri(result.assets[0].uri);
  };

  const removeImage = () => Alert.alert('Remover foto', 'Deseja remover a foto?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Remover', style: 'destructive', onPress: () => setImageUri(null) },
  ]);

  const updateAttr = (key, value) => setAttributes((prev) => ({ ...prev, [key]: clampAttribute(value) }));

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Nome é obrigatório';
    const num = parseInt(number, 10);
    if (number && (isNaN(num) || num < 0 || num > 99)) e.number = 'Número inválido (0-99)';
    const ov = parseInt(overall, 10);
    if (isNaN(ov) || ov < 0 || ov > 100) e.overall = 'Overall deve ser entre 0 e 100';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const now = new Date().toISOString();
    const playerData = {
      id: isEditing ? editingId : generateId(), name: name.trim(), nickname: nickname.trim() || undefined,
      number: number ? parseInt(number, 10) : undefined, position, overall: parseInt(overall, 10),
      attributes, imageUri: imageUri || undefined,
      createdAt: isEditing ? (getPlayerById(editingId)?.createdAt || now) : now, updatedAt: now,
    };
    if (isEditing) await updatePlayer(playerData); else await addPlayer(playerData);
    setSaving(false); navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><ArrowLeft size={22} color={colors.textPrimary} /></TouchableOpacity>
          <Text style={styles.headerTitle}>{isEditing ? 'Editar jogador' : 'Novo jogador'}</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={pickImage} style={styles.photoBtn} activeOpacity={0.7}>
              {imageUri ? <Image source={{ uri: imageUri }} style={styles.photoPreview} /> :
                <View style={styles.photoPlaceholder}><Camera size={28} color={colors.textMuted} /><Text style={styles.photoText}>Adicionar foto</Text></View>}
            </TouchableOpacity>
            {imageUri && <TouchableOpacity onPress={removeImage} style={styles.removePhotoBtn}><X size={16} color={colors.error} /></TouchableOpacity>}
          </View>
          <Input label="Nome *" value={name} onChangeText={setName} placeholder="Nome do jogador" error={errors.name} />
          <Input label="Apelido" value={nickname} onChangeText={setNickname} placeholder="Apelido (opcional)" />
          <Input label="Número da camisa" value={number} onChangeText={(t) => setNumber(t.replace(/[^0-9]/g, ''))} placeholder="Ex: 10" keyboardType="numeric" error={errors.number} />
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Posição *</Text>
            <TouchableOpacity style={styles.selectBtn} onPress={() => setPosModalVisible(true)}>
              <Text style={styles.selectText}>{POSITIONS[position]?.label || 'Selecione'}</Text>
              <ChevronDown size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Modal visible={posModalVisible} transparent animationType="fade" onRequestClose={() => setPosModalVisible(false)}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setPosModalVisible(false)}>
              <View style={styles.sheet}>
                <Text style={styles.sheetTitle}>Escolher posição</Text>
                <FlatList data={POSITION_LIST} keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.posOption, item === position && styles.posOptionActive]}
                      onPress={() => { setPosition(item); setPosModalVisible(false); }}>
                      <View><Text style={[styles.posLabel, item === position && styles.posLabelActive]}>{POSITIONS[item].label}</Text><Text style={styles.posShort}>{POSITIONS[item].shortLabel}</Text></View>
                      {item === position && <Check size={18} color={colors.primary} />}
                    </TouchableOpacity>
                  )} />
              </View>
            </TouchableOpacity>
          </Modal>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Overall *</Text>
            <View style={styles.sliderRow}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => setOverall(Math.max(0, parseInt(overall || '0', 10) - 5).toString())}>
                <Text style={styles.stepperText}>-5</Text>
              </TouchableOpacity>
              <Input value={overall} onChangeText={(t) => setOverall(t.replace(/[^0-9]/g, ''))} keyboardType="numeric" style={{ flex: 1 }} error={errors.overall} />
              <TouchableOpacity style={styles.stepperBtn} onPress={() => setOverall(Math.min(100, parseInt(overall || '0', 10) + 5).toString())}>
                <Text style={styles.stepperText}>+5</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.sectionTitle}>Atributos</Text>
          {ATTRIBUTES.map((attr) => (
            <View key={attr.key} style={styles.attrRow}>
              <Text style={styles.attrLabel}>{attr.label}</Text>
              <View style={styles.attrControls}>
                <TouchableOpacity style={styles.stepperBtnSmall} onPress={() => updateAttr(attr.key, attributes[attr.key] - 5)}>
                  <Text style={styles.stepperTextSmall}>-</Text>
                </TouchableOpacity>
                <Text style={styles.attrValue}>{attributes[attr.key]}</Text>
                <TouchableOpacity style={styles.stepperBtnSmall} onPress={() => updateAttr(attr.key, attributes[attr.key] + 5)}>
                  <Text style={styles.stepperTextSmall}>+</Text>
                </TouchableOpacity>
                <View style={styles.attrTrack}><View style={[styles.attrFill, { width: `${attributes[attr.key]}%` }]} /></View>
              </View>
            </View>
          ))}
          <View style={styles.actions}>
            <Button title="Cancelar" onPress={() => navigation.goBack()} variant="secondary" style={{ flex: 1 }} />
            <Button title="Salvar jogador" onPress={handleSave} loading={saving} style={{ flex: 1 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary },
  container: { flex: 1 }, content: { padding: spacing.xl, paddingBottom: spacing.xxxl * 2, gap: spacing.lg },
  photoSection: { alignItems: 'center', position: 'relative' },
  photoBtn: { width: 100, height: 100, borderRadius: 50, overflow: 'hidden', backgroundColor: colors.surfaceLight, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  photoPreview: { width: 100, height: 100 },
  photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  photoText: { fontSize: fontSize.xs, color: colors.textMuted },
  removePhotoBtn: { position: 'absolute', top: 0, right: '30%', width: 24, height: 24, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.error },
  field: { gap: spacing.xs },
  fieldLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSecondary },
  selectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border },
  selectText: { fontSize: fontSize.md, color: colors.textPrimary },
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.xl, maxHeight: '60%' },
  sheetTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.lg },
  posOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.lg, paddingHorizontal: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.xs },
  posOptionActive: { backgroundColor: colors.primary + '15' },
  posLabel: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  posLabelActive: { color: colors.primary },
  posShort: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepperBtn: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  stepperText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textPrimary },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary },
  attrRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  attrLabel: { width: 70, fontSize: fontSize.sm, color: colors.textSecondary },
  attrControls: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepperBtnSmall: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  stepperTextSmall: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textPrimary },
  attrValue: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.textPrimary, minWidth: 28, textAlign: 'center' },
  attrTrack: { flex: 1, height: 6, backgroundColor: colors.surfaceLight, borderRadius: 3, overflow: 'hidden' },
  attrFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
});
