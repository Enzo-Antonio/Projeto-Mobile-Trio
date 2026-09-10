import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Check, Camera, X, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../hooks/AppContext';
import { Button, Input } from '../components';
import { POSITIONS, ATTRIBUTES } from '../constants';
import { generateId, clampAttribute } from '../utils';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

const POSITION_LIST = Object.keys(POSITIONS);

const DEFAULT_ATTRIBUTES = {
  speed: 70,
  shooting: 70,
  stamina: 70,
  passing: 70,
  dribbling: 70,
  defending: 70,
};

export default function PlayerFormScreen({ navigation, route }) {
  const { addPlayer, updatePlayer, getPlayerById } = useAppContext();
  const editingId = route.params?.playerId;
  const isEditing = Boolean(editingId);

  const [form, setForm] = useState({
    name: '',
    nickname: '',
    number: '',
    position: 'FIXO',
    overall: '70',
    imageUri: null,
    attributes: { ...DEFAULT_ATTRIBUTES },
  });

  const [errors, setErrors] = useState({});
  const [posModalVisible, setPosModalVisible] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const player = getPlayerById(editingId);
      if (player) {
        setForm({
          name: player.name || '',
          nickname: player.nickname || '',
          number: player.number?.toString() || '',
          position: player.position || 'FIXO',
          overall: player.overall?.toString() || '70',
          imageUri: player.imageUri || null,
          attributes: player.attributes || { ...DEFAULT_ATTRIBUTES },
        });
      }
    }
  }, [editingId, isEditing, getPlayerById]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateAttribute = (key, delta) => {
    setForm((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: clampAttribute((prev.attributes[key] || 70) + delta),
      },
    }));
  };

  const adjustOverall = (delta) => {
    const current = parseInt(form.overall || '0', 10);
    updateField('overall', clampAttribute(current + delta).toString());
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]) {
      updateField('imageUri', result.assets[0].uri);
    }
  };

  const removeImage = () => {
    Alert.alert('Remover foto', 'Deseja remover a foto do jogador?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => updateField('imageUri', null) },
    ]);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nome é obrigatório';

    const num = parseInt(form.number, 10);
    if (form.number && (isNaN(num) || num < 0 || num > 99)) {
      errs.number = 'Número inválido (0-99)';
    }

    const ov = parseInt(form.overall, 10);
    if (isNaN(ov) || ov < 0 || ov > 100) {
      errs.overall = 'Overall deve ser entre 0 e 100';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const now = new Date().toISOString();
    const playerData = {
      id: isEditing ? editingId : generateId(),
      name: form.name.trim(),
      nickname: form.nickname.trim() || undefined,
      number: form.number ? parseInt(form.number, 10) : undefined,
      position: form.position,
      overall: parseInt(form.overall, 10),
      attributes: form.attributes,
      imageUri: form.imageUri || undefined,
      createdAt: isEditing ? (getPlayerById(editingId)?.createdAt || now) : now,
      updatedAt: now,
    };

    if (isEditing) {
      await updatePlayer(playerData);
    } else {
      await addPlayer(playerData);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <ArrowLeft size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEditing ? 'Editar jogador' : 'Novo jogador'}</Text>
          <View style={styles.iconBtnPlaceholder} />
        </View>

        <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={pickImage} style={styles.photoBtn} activeOpacity={0.7}>
              {form.imageUri ? (
                <Image source={{ uri: form.imageUri }} style={styles.photoPreview} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Camera size={28} color={colors.textMuted} />
                  <Text style={styles.photoText}>Adicionar foto</Text>
                </View>
              )}
            </TouchableOpacity>
            {form.imageUri && (
              <TouchableOpacity onPress={removeImage} style={styles.removePhotoBtn}>
                <X size={16} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>

          <Input
            label="Nome *"
            value={form.name}
            onChangeText={(t) => updateField('name', t)}
            placeholder="Nome do jogador"
            error={errors.name}
          />

          <Input
            label="Apelido"
            value={form.nickname}
            onChangeText={(t) => updateField('nickname', t)}
            placeholder="Apelido (opcional)"
          />

          <Input
            label="Número da camisa"
            value={form.number}
            onChangeText={(t) => updateField('number', t.replace(/[^0-9]/g, ''))}
            placeholder="Ex: 10"
            keyboardType="numeric"
            error={errors.number}
          />

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Posição *</Text>
            <TouchableOpacity style={styles.selectBtn} onPress={() => setPosModalVisible(true)}>
              <Text style={styles.selectText}>{POSITIONS[form.position]?.label || 'Selecione'}</Text>
              <ChevronDown size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Modal visible={posModalVisible} transparent animationType="fade" onRequestClose={() => setPosModalVisible(false)}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setPosModalVisible(false)}>
              <View style={styles.sheet}>
                <Text style={styles.sheetTitle}>Escolher posição</Text>
                <FlatList
                  data={POSITION_LIST}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => {
                    const isSelected = item === form.position;
                    return (
                      <TouchableOpacity
                        style={[styles.posOption, isSelected && styles.posOptionActive]}
                        onPress={() => {
                          updateField('position', item);
                          setPosModalVisible(false);
                        }}
                      >
                        <View>
                          <Text style={[styles.posLabel, isSelected && styles.posLabelActive]}>
                            {POSITIONS[item].label}
                          </Text>
                          <Text style={styles.posShort}>{POSITIONS[item].shortLabel}</Text>
                        </View>
                        {isSelected && <Check size={18} color={colors.primary} />}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Overall *</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustOverall(-5)}>
                <Text style={styles.stepperText}>-5</Text>
              </TouchableOpacity>
              <Input
                value={form.overall}
                onChangeText={(t) => updateField('overall', t.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                style={styles.overallInput}
                error={errors.overall}
              />
              <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustOverall(5)}>
                <Text style={styles.stepperText}>+5</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Atributos</Text>
          {ATTRIBUTES.map((attr) => {
            const val = form.attributes[attr.key] || 70;
            return (
              <View key={attr.key} style={styles.attrRow}>
                <Text style={styles.attrLabel}>{attr.label}</Text>
                <View style={styles.attrControls}>
                  <TouchableOpacity style={styles.stepperBtnSmall} onPress={() => updateAttribute(attr.key, -5)}>
                    <Text style={styles.stepperTextSmall}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.attrValue}>{val}</Text>
                  <TouchableOpacity style={styles.stepperBtnSmall} onPress={() => updateAttribute(attr.key, 5)}>
                    <Text style={styles.stepperTextSmall}>+</Text>
                  </TouchableOpacity>
                  <View style={styles.attrTrack}>
                    <View style={[styles.attrFill, { width: `${val}%` }]} />
                  </View>
                </View>
              </View>
            );
          })}

          <View style={styles.actions}>
            <Button title="Cancelar" onPress={() => navigation.goBack()} variant="secondary" style={styles.flex} />
            <Button title={isEditing ? 'Salvar' : 'Cadastrar'} onPress={handleSave} style={styles.flex} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  iconBtnPlaceholder: { width: 40 },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl * 2, gap: spacing.lg },
  photoSection: { alignItems: 'center', marginBottom: spacing.sm },
  photoBtn: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.surfaceLight, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border },
  photoPreview: { width: '100%', height: '100%' },
  photoPlaceholder: { alignItems: 'center', gap: spacing.xs },
  photoText: { fontSize: fontSize.xs, color: colors.textMuted },
  removePhotoBtn: { position: 'absolute', top: 0, right: '35%', backgroundColor: colors.surface, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: colors.border },
  field: { gap: spacing.xs },
  fieldLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textSecondary },
  selectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  selectText: { fontSize: fontSize.md, color: colors.textPrimary },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.xl, maxHeight: '60%' },
  sheetTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.lg },
  posOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, paddingHorizontal: spacing.md, borderRadius: borderRadius.md },
  posOptionActive: { backgroundColor: colors.surfaceLight },
  posLabel: { fontSize: fontSize.md, color: colors.textPrimary, fontWeight: fontWeight.medium },
  posLabelActive: { color: colors.primary, fontWeight: fontWeight.bold },
  posShort: { fontSize: fontSize.xs, color: colors.textMuted },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepperBtn: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  stepperText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textPrimary },
  overallInput: { flex: 1 },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, marginTop: spacing.md },
  attrRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.xs },
  attrLabel: { fontSize: fontSize.sm, color: colors.textSecondary, width: 90 },
  attrControls: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepperBtnSmall: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  stepperTextSmall: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.textPrimary },
  attrValue: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.textPrimary, width: 28, textAlign: 'center' },
  attrTrack: { flex: 1, height: 6, backgroundColor: colors.surfaceLight, borderRadius: 3, overflow: 'hidden' },
  attrFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
});
