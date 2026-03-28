import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  color?: string;
}

export function StatCard({ icon, label, value, color = COLORS.primary }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  value: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
    textAlign: 'center',
  },
});
