import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../src/context/AppContext';
import { CHALLENGE_TEMPLATES } from '../../src/constants/challenges';
import { ChallengeCard } from '../../src/components/ChallengeCard';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../src/constants/theme';
import { formatCurrency } from '../../src/utils/helpers';

export default function ChallengesScreen() {
  const { startChallenge, activeChallenges, profile } = useApp();

  const isAlreadyActive = (templateId: string) =>
    activeChallenges.some((c) => c.templateId === templateId);

  const handleStart = (template: (typeof CHALLENGE_TEMPLATES)[0]) => {
    if (isAlreadyActive(template.id)) {
      Alert.alert('Already Active', 'You already have this challenge running!');
      return;
    }
    if (template.isPremium && !profile.isPremium) {
      Alert.alert(
        'Premium Challenge',
        'Upgrade to Premium to unlock this challenge and get unlimited active challenges!',
      );
      return;
    }
    Alert.alert(
      `Start ${template.name}?`,
      `Goal: ${formatCurrency(template.totalSavingsGoal)} in ${template.durationDays} days.\n\nAre you ready?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: "Let's Go!",
          onPress: () => startChallenge(template),
        },
      ],
    );
  };

  const freeTemplates = CHALLENGE_TEMPLATES.filter((t) => !t.isPremium);
  const premiumTemplates = CHALLENGE_TEMPLATES.filter((t) => t.isPremium);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Challenge Library</Text>
        <Text style={styles.subtitle}>
          Pick a challenge and start saving today
        </Text>

        {/* Free Challenges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Free Challenges</Text>
          {freeTemplates.map((template) => (
            <ChallengeCard
              key={template.id}
              icon={template.icon}
              name={template.name}
              description={template.description}
              color={template.color}
              onPress={() => handleStart(template)}
            />
          ))}
        </View>

        {/* Premium Challenges */}
        <View style={styles.section}>
          <View style={styles.premiumHeader}>
            <Text style={styles.sectionTitle}>Premium Challenges</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proText}>PRO</Text>
            </View>
          </View>
          {premiumTemplates.map((template) => (
            <ChallengeCard
              key={template.id}
              icon={template.icon}
              name={template.name}
              description={template.description}
              color={template.color}
              isPremium
              onPress={() => handleStart(template)}
            />
          ))}
        </View>

        {/* Upgrade Banner */}
        {!profile.isPremium && (
          <TouchableOpacity style={styles.upgradeBanner}>
            <Text style={styles.upgradeIcon}>⚡</Text>
            <View style={styles.upgradeContent}>
              <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
              <Text style={styles.upgradeSubtitle}>
                Unlimited challenges, advanced analytics, all badges
              </Text>
            </View>
            <Text style={styles.upgradePrice}>$4.99/mo</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    marginTop: SPACING.md,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  proBadge: {
    backgroundColor: COLORS.warning + '30',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  proText: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  upgradeIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  upgradeContent: {
    flex: 1,
  },
  upgradeTitle: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  upgradeSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  upgradePrice: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
});
