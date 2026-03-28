import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface CareActionButtonProps {
  emoji: string;
  label: string;
  color?: string;
  onPress: () => void;
  small?: boolean;
}

export function CareActionButton({
  emoji,
  label,
  color = COLORS.primary,
  onPress,
  small,
}: CareActionButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color + '12', borderColor: color + '30' },
        small && styles.small,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.emoji, small && styles.smallEmoji]}>{emoji}</Text>
      <Text style={[styles.label, { color }, small && styles.smallLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    flex: 1,
    minWidth: 75,
  },
  small: {
    paddingVertical: SPACING.sm,
    minWidth: 60,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  smallEmoji: {
    fontSize: 20,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  smallLabel: {
    fontSize: 9,
  },
});
