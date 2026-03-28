import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { PetType, PetGender } from '../../src/types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, PET_TYPE_EMOJIS } from '../../src/constants/theme';

const PET_TYPES: PetType[] = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'reptile', 'other'];
const GENDERS: { key: PetGender; label: string }[] = [
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' },
  { key: 'unknown', label: 'Unknown' },
];
const PET_COLORS = ['#FF6B4A', '#4ECDC4', '#FFD93D', '#9C8FFF', '#FF9999', '#45B7D1', '#96CEB4', '#FFEAA7'];

export default function AddPetScreen() {
  const router = useRouter();
  const { addPet } = useApp();
  const [name, setName] = useState('');
  const [type, setType] = useState<PetType>('dog');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<PetGender>('unknown');
  const [birthday, setBirthday] = useState('');
  const [color, setColor] = useState(PET_COLORS[0]);
  const [weight, setWeight] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your pet\'s name.');
      return;
    }

    const petId = await addPet({
      name: name.trim(),
      type,
      breed: breed.trim() || 'Mixed',
      gender,
      birthday: birthday || new Date().toISOString().split('T')[0],
      adoptedDate: new Date().toISOString().split('T')[0],
      color,
      weight: weight ? parseFloat(weight) : undefined,
    });

    if (petId) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add a Pet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Pet Type */}
        <Text style={styles.label}>What kind of pet?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeRow}>
          {PET_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeBtn, type === t && styles.typeBtnActive]}
              onPress={() => setType(t)}
            >
              <Text style={styles.typeEmoji}>{PET_TYPE_EMOJIS[t]}</Text>
              <Text style={[styles.typeLabel, type === t && styles.typeLabelActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="What's your pet's name?"
          placeholderTextColor={COLORS.textMuted}
          value={name}
          onChangeText={setName}
          autoFocus
        />

        {/* Breed */}
        <Text style={styles.label}>Breed</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Golden Retriever, Tabby"
          placeholderTextColor={COLORS.textMuted}
          value={breed}
          onChangeText={setBreed}
        />

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          {GENDERS.map((g) => (
            <TouchableOpacity
              key={g.key}
              style={[styles.genderBtn, gender === g.key && styles.genderBtnActive]}
              onPress={() => setGender(g.key)}
            >
              <Text style={[styles.genderLabel, gender === g.key && styles.genderLabelActive]}>
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Birthday */}
        <Text style={styles.label}>Birthday</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={COLORS.textMuted}
          value={birthday}
          onChangeText={setBirthday}
        />

        {/* Weight */}
        <Text style={styles.label}>Weight (lbs)</Text>
        <TextInput
          style={styles.input}
          placeholder="Optional"
          placeholderTextColor={COLORS.textMuted}
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
        />

        {/* Theme Color */}
        <Text style={styles.label}>Theme Color</Text>
        <View style={styles.colorRow}>
          {PET_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorBtn,
                { backgroundColor: c },
                color === c && styles.colorBtnActive,
              ]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Add {name || 'Pet'} 🐾</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.sm },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: COLORS.text, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  label: { color: COLORS.text, fontSize: FONT_SIZE.lg, fontWeight: '600', marginBottom: SPACING.sm, marginTop: SPACING.lg },
  typeRow: { marginBottom: SPACING.sm },
  typeBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.card,
    marginRight: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minWidth: 70,
  },
  typeBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  typeEmoji: { fontSize: 28, marginBottom: 4 },
  typeLabel: { color: COLORS.textSecondary, fontSize: FONT_SIZE.xs, fontWeight: '600' },
  typeLabelActive: { color: COLORS.primary },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  genderRow: { flexDirection: 'row', gap: SPACING.sm },
  genderBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  genderBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  genderLabel: { color: COLORS.textSecondary, fontSize: FONT_SIZE.md, fontWeight: '600' },
  genderLabelActive: { color: COLORS.primary },
  colorRow: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  colorBtn: { width: 36, height: 36, borderRadius: 18 },
  colorBtnActive: { borderWidth: 3, borderColor: COLORS.text },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  saveBtnText: { color: '#fff', fontSize: FONT_SIZE.xl, fontWeight: '700' },
});
