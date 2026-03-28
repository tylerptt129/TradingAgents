import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge, BadgeRarity } from '../types';
import { COLORS, SP, FS, RADIUS } from '../constants/theme';

const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: '#9E9E9E',
  rare: '#38BDF8',
  epic: '#A78BFA',
  legendary: '#FBBF24',
};

export function BadgeCard({ badge, unlocked }: { badge: Badge; unlocked: boolean }) {
  const color = RARITY_COLORS[badge.rarity];
  return (
    <View style={[styles.card, !unlocked && styles.locked]}>
      <View style={[styles.iconRing, { borderColor: unlocked ? color : COLORS.border }]}>
        <Text style={styles.icon}>{unlocked ? badge.icon : '🔒'}</Text>
      </View>
      <Text style={[styles.name, !unlocked && styles.lockedText]} numberOfLines={1}>{badge.name}</Text>
      <Text style={[styles.desc, !unlocked && styles.lockedText]} numberOfLines={2}>{badge.description}</Text>
      <View style={[styles.rarity, { backgroundColor: color + '18' }]}>
        <Text style={[styles.rarityText, { color }]}>{badge.rarity.toUpperCase()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SP.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    width: '48%',
    marginBottom: SP.sm,
  },
  locked: { opacity: 0.4 },
  iconRing: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: SP.sm },
  icon: { fontSize: 24 },
  name: { color: COLORS.text, fontSize: FS.small, fontWeight: '600', textAlign: 'center' },
  desc: { color: COLORS.textSecondary, fontSize: FS.caption, textAlign: 'center', marginTop: 2, lineHeight: 14 },
  lockedText: { color: COLORS.textGhost },
  rarity: { paddingHorizontal: SP.sm, paddingVertical: 2, borderRadius: RADIUS.full, marginTop: SP.sm },
  rarityText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
});
