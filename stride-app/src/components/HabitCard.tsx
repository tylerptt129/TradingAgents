import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SP, FS, RADIUS, CARD_SHADOW, GradientName } from '../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface HabitCardProps {
  name: string;
  icon: string;
  gradient: GradientName;
  streak: number;
  completed: boolean;
  completionCount: number;
  targetPerDay: number;
  onToggle: () => void;
  onPress: () => void;
}

export function HabitCard({
  name,
  icon,
  gradient,
  streak,
  completed,
  completionCount,
  targetPerDay,
  onToggle,
  onPress,
}: HabitCardProps) {
  const colors = GRADIENTS[gradient] || GRADIENTS.violet;
  const progress = Math.min(completionCount / targetPerDay, 1);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wrapper}>
      <View style={[styles.card, completed && styles.cardCompleted, CARD_SHADOW]}>
        {/* Gradient accent bar */}
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradientBar, completed && styles.gradientBarFull]}
        />

        <View style={styles.content}>
          {/* Left: Icon + Info */}
          <View style={styles.left}>
            <View style={[styles.iconCircle, { backgroundColor: colors[0] + '18' }]}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, completed && styles.nameCompleted]} numberOfLines={1}>
                {name}
              </Text>
              <View style={styles.meta}>
                {streak > 0 && (
                  <View style={styles.streakBadge}>
                    <Text style={styles.streakIcon}>🔥</Text>
                    <Text style={[styles.streakText, { color: colors[0] }]}>{streak}d</Text>
                  </View>
                )}
                {targetPerDay > 1 && (
                  <Text style={styles.countText}>
                    {completionCount}/{targetPerDay}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Right: Completion button */}
          <TouchableOpacity
            onPress={onToggle}
            activeOpacity={0.7}
            style={styles.checkBtnOuter}
          >
            {completed ? (
              <LinearGradient
                colors={colors}
                style={styles.checkBtnDone}
              >
                <Text style={styles.checkmark}>✓</Text>
              </LinearGradient>
            ) : (
              <View style={styles.checkBtnEmpty}>
                {progress > 0 && progress < 1 && (
                  <View style={[styles.progressArc, { backgroundColor: colors[0] + '30' }]}>
                    <Text style={[styles.progressText, { color: colors[0] }]}>
                      {completionCount}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Progress bar for multi-target habits */}
        {targetPerDay > 1 && (
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: SP.sm },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardCompleted: {
    borderColor: 'transparent',
    opacity: 0.85,
  },
  gradientBar: {
    height: 3,
    opacity: 0.5,
  },
  gradientBarFull: {
    opacity: 1,
    height: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SP.md,
    paddingVertical: SP.md,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SP.md,
  },
  icon: { fontSize: 24 },
  info: { flex: 1 },
  name: { color: COLORS.text, fontSize: FS.headline, fontWeight: '600', letterSpacing: -0.2 },
  nameCompleted: { color: COLORS.textSecondary, textDecorationLine: 'line-through' },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', marginRight: SP.sm },
  streakIcon: { fontSize: 12, marginRight: 2 },
  streakText: { fontSize: FS.small, fontWeight: '700' },
  countText: { color: COLORS.textMuted, fontSize: FS.small },
  checkBtnOuter: { marginLeft: SP.md },
  checkBtnDone: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: { color: '#fff', fontSize: 20, fontWeight: '800' },
  checkBtnEmpty: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressArc: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: { fontSize: FS.small, fontWeight: '700' },
  progressBarBg: {
    height: 3,
    backgroundColor: COLORS.border,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
