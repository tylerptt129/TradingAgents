import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { MoodPicker } from '../../src/components/MoodPicker';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, MOOD_CONFIG, ACTIVITY_CONFIG } from '../../src/constants/theme';
import { formatDate, getTodayStr } from '../../src/utils/helpers';
import { MoodType, ActivityType } from '../../src/types';

const ACTIVITIES: ActivityType[] = ['feeding', 'walk', 'play', 'grooming', 'bath', 'medication'];

export default function JournalScreen() {
  const { selectedPetId, pets, journal, profile, addJournalEntry } = useApp();
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [mood, setMood] = useState<MoodType | undefined>();
  const [note, setNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<ActivityType[]>([]);

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const petJournal = journal.filter((j) => j.petId === selectedPetId);

  const toggleActivity = (a: ActivityType) => {
    setSelectedActivities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };

  const handleSubmit = async () => {
    if (!mood || !note.trim() || !selectedPetId) {
      Alert.alert('Missing Info', 'Please select a mood and write a note.');
      return;
    }
    await addJournalEntry({
      petId: selectedPetId,
      date: getTodayStr(),
      mood,
      note: note.trim(),
      activities: selectedActivities,
    });
    setShowAdd(false);
    setMood(undefined);
    setNote('');
    setSelectedActivities([]);
  };

  if (!selectedPet) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Journal</Text>
        <Text style={styles.emptyText}>Add a pet first!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{selectedPet.name}'s Journal</Text>

        {/* New Entry Button */}
        <TouchableOpacity
          style={styles.newEntryBtn}
          onPress={() => setShowAdd(!showAdd)}
        >
          <Text style={styles.newEntryBtnText}>
            {showAdd ? 'Cancel' : '+ New Journal Entry'}
          </Text>
        </TouchableOpacity>

        {/* Add form */}
        {showAdd && (
          <View style={styles.addForm}>
            <MoodPicker selected={mood} onSelect={setMood} />

            <Text style={styles.formLabel}>What happened today?</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Write about your pet's day..."
              placeholderTextColor={COLORS.textMuted}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text style={styles.formLabel}>Activities</Text>
            <View style={styles.activityGrid}>
              {ACTIVITIES.map((a) => {
                const config = ACTIVITY_CONFIG[a];
                const selected = selectedActivities.includes(a);
                return (
                  <TouchableOpacity
                    key={a}
                    style={[styles.activityChip, selected && styles.activityChipActive]}
                    onPress={() => toggleActivity(a)}
                  >
                    <Text style={styles.activityEmoji}>{config.emoji}</Text>
                    <Text style={[styles.activityLabel, selected && styles.activityLabelActive]}>
                      {config.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Journal Entries */}
        {petJournal.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptySubtitle}>
              Start journaling your pet's daily life, moods, and memories!
            </Text>
          </View>
        ) : (
          petJournal.map((entry) => {
            const moodCfg = MOOD_CONFIG[entry.mood];
            return (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <View style={[styles.moodBadge, { backgroundColor: moodCfg?.color + '20' }]}>
                    <Text style={styles.moodEmoji}>{moodCfg?.emoji}</Text>
                    <Text style={[styles.moodLabel, { color: moodCfg?.color }]}>
                      {moodCfg?.label}
                    </Text>
                  </View>
                  <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                </View>

                {entry.photoUri && (
                  <Image source={{ uri: entry.photoUri }} style={styles.entryPhoto} />
                )}

                <Text style={styles.entryNote}>{entry.note}</Text>

                {entry.activities.length > 0 && (
                  <View style={styles.entryActivities}>
                    {entry.activities.map((a) => (
                      <View key={a} style={styles.entryActivityChip}>
                        <Text style={styles.entryActivityText}>
                          {ACTIVITY_CONFIG[a]?.emoji} {ACTIVITY_CONFIG[a]?.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.md },
  title: { color: COLORS.text, fontSize: FONT_SIZE.xxl, fontWeight: '700', marginTop: SPACING.md, marginBottom: SPACING.md },
  newEntryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  newEntryBtnText: { color: '#fff', fontSize: FONT_SIZE.md, fontWeight: '700' },
  addForm: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formLabel: { color: COLORS.text, fontSize: FONT_SIZE.lg, fontWeight: '600', marginBottom: SPACING.sm, marginTop: SPACING.md },
  noteInput: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  activityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  activityChipActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  activityEmoji: { fontSize: 14, marginRight: 4 },
  activityLabel: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  activityLabelActive: { color: COLORS.primary },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  submitBtnText: { color: '#fff', fontSize: FONT_SIZE.lg, fontWeight: '700' },
  emptyState: { alignItems: 'center', marginTop: SPACING.xxl },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.sm },
  emptyTitle: { color: COLORS.text, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  emptySubtitle: { color: COLORS.textSecondary, fontSize: FONT_SIZE.md, textAlign: 'center', marginTop: 4 },
  emptyText: { color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xl, fontSize: FONT_SIZE.md },
  entryCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  moodBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: SPACING.sm, borderRadius: BORDER_RADIUS.full },
  moodEmoji: { fontSize: 16, marginRight: 4 },
  moodLabel: { fontSize: FONT_SIZE.sm, fontWeight: '600' },
  entryDate: { color: COLORS.textMuted, fontSize: FONT_SIZE.sm },
  entryPhoto: { width: '100%', height: 200, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.sm },
  entryNote: { color: COLORS.text, fontSize: FONT_SIZE.md, lineHeight: 22 },
  entryActivities: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: SPACING.sm },
  entryActivityChip: { backgroundColor: COLORS.backgroundDark, paddingVertical: 2, paddingHorizontal: SPACING.sm, borderRadius: BORDER_RADIUS.full },
  entryActivityText: { color: COLORS.textSecondary, fontSize: FONT_SIZE.xs },
});
