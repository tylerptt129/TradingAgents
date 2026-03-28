import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { COLORS, GRADIENTS, GRADIENT_NAMES, SP, FS, RADIUS, CARD_SHADOW, GradientName } from '../../src/constants/theme';
import { HABIT_PRESETS, PRESET_CATEGORIES } from '../../src/constants/presets';
import { HabitFrequency, TimeOfDay, DayOfWeek } from '../../src/types';

const FREQUENCIES: { label: string; value: HabitFrequency }[] = [
  { label: 'Every Day', value: 'daily' },
  { label: 'Weekdays', value: 'weekdays' },
  { label: 'Weekends', value: 'weekends' },
  { label: 'Custom', value: 'custom' },
];

const TIME_OPTIONS: { label: string; value: TimeOfDay; icon: string }[] = [
  { label: 'Morning', value: 'morning', icon: '🌅' },
  { label: 'Afternoon', value: 'afternoon', icon: '☀️' },
  { label: 'Evening', value: 'evening', icon: '🌙' },
  { label: 'Anytime', value: 'anytime', icon: '⏰' },
];

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const POPULAR_ICONS = ['💪', '📚', '💧', '🧘', '🏃', '📝', '🎯', '💊', '😴', '🍳', '🎨', '💻', '🌱', '🦷', '🧹', '💰'];

export default function AddHabitScreen() {
  const { addHabit } = useApp();
  const router = useRouter();

  const [step, setStep] = useState<'presets' | 'custom'>('presets');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💪');
  const [gradient, setGradient] = useState<GradientName>('violet');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [customDays, setCustomDays] = useState<DayOfWeek[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('anytime');
  const [targetPerDay, setTargetPerDay] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(PRESET_CATEGORIES[0]);

  const handlePresetSelect = (preset: typeof HABIT_PRESETS[0]) => {
    setName(preset.name);
    setIcon(preset.icon);
    setGradient(preset.gradient);
    setStep('custom');
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Give your habit a name.');
      return;
    }
    if (frequency === 'custom' && customDays.length === 0) {
      Alert.alert('Select Days', 'Choose at least one day for your habit.');
      return;
    }

    const id = await addHabit({
      name: name.trim(),
      icon,
      gradient,
      frequency,
      customDays: frequency === 'custom' ? customDays : undefined,
      timeOfDay,
      targetPerDay,
    });

    if (id) {
      router.back();
    }
  };

  const toggleDay = (day: DayOfWeek) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  if (step === 'presets') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Modal handle */}
          <View style={styles.handle} />

          <Text style={styles.title}>New Habit</Text>
          <Text style={styles.subtitle}>Pick a preset or create your own</Text>

          {/* Category pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {PRESET_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Preset grid */}
          <View style={styles.presetGrid}>
            {HABIT_PRESETS.filter((p) => p.category === selectedCategory).map((preset, i) => {
              const colors = GRADIENTS[preset.gradient];
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.presetCard}
                  onPress={() => handlePresetSelect(preset)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.presetIcon, { backgroundColor: colors[0] + '18' }]}>
                    <Text style={{ fontSize: 24 }}>{preset.icon}</Text>
                  </View>
                  <Text style={styles.presetName} numberOfLines={1}>{preset.name}</Text>
                  <View style={[styles.presetDot, { backgroundColor: colors[0] }]} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom button */}
          <TouchableOpacity
            style={styles.customBtn}
            onPress={() => setStep('custom')}
            activeOpacity={0.8}
          >
            <Text style={styles.customBtnIcon}>✨</Text>
            <Text style={styles.customBtnText}>Create Custom Habit</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Custom builder step
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.handle} />

        {/* Back button */}
        <TouchableOpacity onPress={() => setStep('presets')} style={styles.backBtn}>
          <Text style={styles.backText}>← Presets</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Configure Habit</Text>

        {/* Preview card */}
        <View style={styles.previewCard}>
          <LinearGradient
            colors={GRADIENTS[gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.previewBar}
          />
          <View style={styles.previewContent}>
            <View style={[styles.previewIconCircle, { backgroundColor: GRADIENTS[gradient][0] + '18' }]}>
              <Text style={{ fontSize: 28 }}>{icon}</Text>
            </View>
            <Text style={styles.previewName}>{name || 'Habit Name'}</Text>
          </View>
        </View>

        {/* Name input */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Morning Yoga"
            placeholderTextColor={COLORS.textGhost}
            maxLength={40}
          />
        </View>

        {/* Icon picker */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Icon</Text>
          <View style={styles.iconGrid}>
            {POPULAR_ICONS.map((ic) => (
              <TouchableOpacity
                key={ic}
                style={[styles.iconOption, icon === ic && styles.iconOptionActive]}
                onPress={() => setIcon(ic)}
              >
                <Text style={{ fontSize: 22 }}>{ic}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gradient picker */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Color</Text>
          <View style={styles.gradientGrid}>
            {GRADIENT_NAMES.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.gradientOption, gradient === g && styles.gradientOptionActive]}
                onPress={() => setGradient(g)}
              >
                <LinearGradient
                  colors={GRADIENTS[g]}
                  style={styles.gradientSwatch}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Frequency */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Frequency</Text>
          <View style={styles.freqRow}>
            {FREQUENCIES.map((f) => (
              <TouchableOpacity
                key={f.value}
                style={[styles.freqPill, frequency === f.value && styles.freqPillActive]}
                onPress={() => setFrequency(f.value)}
              >
                <Text style={[styles.freqText, frequency === f.value && styles.freqTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {frequency === 'custom' && (
            <View style={styles.daysRow}>
              {DAY_LABELS.map((label, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.dayBtn, customDays.includes(i as DayOfWeek) && styles.dayBtnActive]}
                  onPress={() => toggleDay(i as DayOfWeek)}
                >
                  <Text
                    style={[styles.dayText, customDays.includes(i as DayOfWeek) && styles.dayTextActive]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Time of Day */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Best Time</Text>
          <View style={styles.timeRow}>
            {TIME_OPTIONS.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[styles.timePill, timeOfDay === t.value && styles.timePillActive]}
                onPress={() => setTimeOfDay(t.value)}
              >
                <Text style={styles.timeIcon}>{t.icon}</Text>
                <Text style={[styles.timeText, timeOfDay === t.value && styles.timeTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Target per day */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Times Per Day</Text>
          <View style={styles.targetRow}>
            <TouchableOpacity
              style={styles.targetBtn}
              onPress={() => setTargetPerDay(Math.max(1, targetPerDay - 1))}
            >
              <Text style={styles.targetBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.targetValue}>{targetPerDay}</Text>
            <TouchableOpacity
              style={styles.targetBtn}
              onPress={() => setTargetPerDay(Math.min(20, targetPerDay + 1))}
            >
              <Text style={styles.targetBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity activeOpacity={0.85} onPress={handleSave}>
          <LinearGradient
            colors={GRADIENTS[gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveBtn}
          >
            <Text style={styles.saveBtnText}>Create Habit</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  content: { paddingHorizontal: SP.lg, paddingBottom: 40 },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: SP.md,
    marginBottom: SP.md,
  },
  title: {
    color: COLORS.text,
    fontSize: FS.largeTitle,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FS.body,
    marginTop: SP.xs,
    marginBottom: SP.lg,
  },
  backBtn: { marginBottom: SP.sm },
  backText: { color: COLORS.primary, fontSize: FS.body, fontWeight: '600' },
  // Category pills
  categoryScroll: { marginBottom: SP.lg },
  categoryPill: {
    paddingHorizontal: SP.md,
    paddingVertical: SP.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgCard,
    marginRight: SP.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },
  categoryText: { color: COLORS.textSecondary, fontSize: FS.small, fontWeight: '600' },
  categoryTextActive: { color: COLORS.primary },
  // Preset grid
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SP.sm,
  },
  presetCard: {
    width: '31%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SP.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  presetIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SP.sm,
  },
  presetName: {
    color: COLORS.text,
    fontSize: FS.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
  presetDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: SP.sm,
  },
  customBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SP.lg,
    marginTop: SP.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  customBtnIcon: { fontSize: 18, marginRight: SP.sm },
  customBtnText: { color: COLORS.primary, fontSize: FS.body, fontWeight: '600' },
  // Preview card
  previewCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginVertical: SP.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  previewBar: { height: 4 },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SP.md,
  },
  previewIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SP.md,
  },
  previewName: {
    color: COLORS.text,
    fontSize: FS.headline,
    fontWeight: '700',
  },
  // Fields
  field: { marginBottom: SP.lg },
  fieldLabel: {
    color: COLORS.textSecondary,
    fontSize: FS.small,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SP.sm,
  },
  input: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SP.md,
    color: COLORS.text,
    fontSize: FS.body,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  // Icon picker
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SP.sm,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  iconOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  // Gradient picker
  gradientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SP.sm,
  },
  gradientOption: {
    width: 40,
    height: 40,
    borderRadius: 12,
    padding: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gradientOptionActive: {
    borderColor: COLORS.text,
  },
  gradientSwatch: {
    flex: 1,
    borderRadius: 9,
  },
  // Frequency
  freqRow: {
    flexDirection: 'row',
    gap: SP.sm,
  },
  freqPill: {
    flex: 1,
    paddingVertical: SP.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  freqPillActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },
  freqText: { color: COLORS.textSecondary, fontSize: FS.caption, fontWeight: '600' },
  freqTextActive: { color: COLORS.primary },
  // Days
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SP.md,
  },
  dayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  dayBtnActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },
  dayText: { color: COLORS.textMuted, fontSize: FS.small, fontWeight: '700' },
  dayTextActive: { color: COLORS.primary },
  // Time
  timeRow: {
    flexDirection: 'row',
    gap: SP.sm,
  },
  timePill: {
    flex: 1,
    paddingVertical: SP.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  timePillActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },
  timeIcon: { fontSize: 16, marginBottom: 2 },
  timeText: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '600' },
  timeTextActive: { color: COLORS.primary },
  // Target
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SP.xl,
  },
  targetBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  targetBtnText: { color: COLORS.text, fontSize: 22, fontWeight: '300' },
  targetValue: { color: COLORS.text, fontSize: FS.hero, fontWeight: '800' },
  // Save
  saveBtn: {
    borderRadius: RADIUS.lg,
    paddingVertical: SP.md,
    alignItems: 'center',
    marginTop: SP.sm,
    ...CARD_SHADOW,
  },
  saveBtnText: { color: '#fff', fontSize: FS.headline, fontWeight: '800' },
});
