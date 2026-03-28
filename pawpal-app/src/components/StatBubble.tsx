import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface StatBubbleProps {
  emoji: string;
  value: string;
  label: string;
  color?: string;
}

export function StatBubble({ emoji, value, label, color = COLORS.primary }: StatBubbleProps) {
  return (
    <View style={[styles.bubble, { backgroundColor: color + '10' }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    flex: 1,
    marginHorizontal: 3,
  },
  emoji: { fontSize: 22, marginBottom: 2 },
  value: { fontSize: FONT_SIZE.xl, fontWeight: '800' },
  label: { color: COLORS.textSecondary, fontSize: FONT_SIZE.xs, marginTop: 2, textAlign: 'center' },
});
