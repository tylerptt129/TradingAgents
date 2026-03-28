import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge, BadgeRarity } from '../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
}

const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: COLORS.badgeCommon,
  rare: COLORS.badgeRare,
  epic: COLORS.badgeEpic,
  legendary: COLORS.badgeLegendary,
};

export function BadgeCard({ badge, unlocked }: BadgeCardProps) {
  const rarityColor = RARITY_COLORS[badge.rarity];

  return (
    <View style={[styles.card, !unlocked && styles.locked]}>
      <View style={[styles.iconCircle, { borderColor: unlocked ? rarityColor : COLORS.border }]}>
        <Text style={[styles.icon, !unlocked && styles.lockedIcon]}>
          {unlocked ? badge.icon : '🔒'}
        </Text>
      </View>
      <Text style={[styles.name, !unlocked && styles.lockedText]} numberOfLines={1}>
        {badge.name}
      </Text>
      <Text style={[styles.description, !unlocked && styles.lockedText]} numberOfLines={2}>
        {badge.description}
      </Text>
      <View style={[styles.rarityBadge, { backgroundColor: rarityColor + '20' }]}>
        <Text style={[styles.rarityText, { color: rarityColor }]}>
          {badge.rarity.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '48%',
    marginBottom: SPACING.sm,
  },
  locked: { opacity: 0.45 },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  icon: { fontSize: 26 },
  lockedIcon: { fontSize: 18 },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 14,
  },
  lockedText: { color: COLORS.textMuted },
  rarityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.sm,
  },
  rarityText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
});
