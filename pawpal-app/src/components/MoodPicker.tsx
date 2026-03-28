import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MoodType } from '../types';
import { MOOD_CONFIG, COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface MoodPickerProps {
  selected?: MoodType;
  onSelect: (mood: MoodType) => void;
}

const MOODS: MoodType[] = ['happy', 'playful', 'sleepy', 'hungry', 'sick', 'anxious'];

export function MoodPicker({ selected, onSelect }: MoodPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>How's your pet feeling?</Text>
      <View style={styles.grid}>
        {MOODS.map((mood) => {
          const config = MOOD_CONFIG[mood];
          const isSelected = selected === mood;
          return (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodBtn,
                isSelected && { backgroundColor: config.color + '25', borderColor: config.color },
              ]}
              onPress={() => onSelect(mood)}
            >
              <Text style={styles.moodEmoji}>{config.emoji}</Text>
              <Text style={[styles.moodLabel, isSelected && { color: config.color }]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  moodBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    minWidth: 80,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  moodLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
});
