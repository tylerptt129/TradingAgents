import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface ChallengeCardProps {
  icon: string;
  name: string;
  description?: string;
  color: string;
  progress?: number;
  savedAmount?: string;
  goalAmount?: string;
  streak?: number;
  isPremium?: boolean;
  onPress?: () => void;
}

export function ChallengeCard({
  icon,
  name,
  description,
  color,
  progress,
  savedAmount,
  goalAmount,
  streak,
  isPremium,
  onPress,
}: ChallengeCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PRO</Text>
            </View>
          )}
        </View>

        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}

        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: color },
                ]}
              />
            </View>
            <View style={styles.stats}>
              {savedAmount && goalAmount && (
                <Text style={styles.statText}>
                  {savedAmount} / {goalAmount}
                </Text>
              )}
              {streak !== undefined && streak > 0 && (
                <Text style={styles.streakText}>🔥 {streak}d</Text>
              )}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: COLORS.warning + '30',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  premiumText: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
    lineHeight: 18,
  },
  progressContainer: {
    marginTop: SPACING.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  streakText: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
});
