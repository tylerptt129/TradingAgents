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
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { StatBubble } from '../../src/components/StatBubble';
import { PetAvatar } from '../../src/components/PetAvatar';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../src/constants/theme';
import { formatDate } from '../../src/utils/helpers';
import * as Storage from '../../src/storage';

export default function ProfileScreen() {
  const { profile, pets, refreshData } = useApp();
  const router = useRouter();

  const handleResetData = () => {
    Alert.alert('Reset All Data', 'This will delete all your pets and data. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await Storage.resetAllData();
          await refreshData();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {/* Avatar */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🐾</Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.joinDate}>Member since {formatDate(profile.joinDate)}</Text>
          {profile.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBubble emoji="🐾" value={`${pets.length}`} label="Pets" color={COLORS.primary} />
          <StatBubble emoji="🔥" value={`${profile.longestCareStreak}d`} label="Best Streak" color={COLORS.warning} />
          <StatBubble emoji="🏥" value={`${profile.totalVetVisits}`} label="Vet Visits" color={COLORS.secondary} />
        </View>
        <View style={styles.statsRow}>
          <StatBubble emoji="📝" value={`${profile.totalJournalEntries}`} label="Entries" color={COLORS.accent} />
          <StatBubble emoji="📸" value={`${profile.totalPhotos}`} label="Photos" color={COLORS.info} />
          <StatBubble emoji="🎖️" value={`${profile.unlockedBadgeIds.length}`} label="Badges" color={COLORS.badgeEpic} />
        </View>

        {/* My Pets */}
        {pets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Pets</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pets.map((pet) => (
                <View key={pet.id} style={styles.petItem}>
                  <PetAvatar
                    name={pet.name}
                    petType={pet.type}
                    photoUri={pet.photoUri}
                    size={64}
                    color={pet.color}
                    onPress={() => router.push(`/pet/${pet.id}`)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          {!profile.isPremium && (
            <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.push('/premium')}>
              <Text style={styles.upgradeBtnIcon}>⚡</Text>
              <View style={styles.upgradeBtnContent}>
                <Text style={styles.upgradeBtnTitle}>Upgrade to Premium</Text>
                <Text style={styles.upgradeBtnSubtitle}>Unlimited pets, meds, vaccines & more</Text>
              </View>
              <Text style={styles.upgradeBtnPrice}>$1.99</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuText}>Notification Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⭐</Text>
            <Text style={styles.menuText}>Rate PawPal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>💬</Text>
            <Text style={styles.menuText}>Send Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.dangerItem]} onPress={handleResetData}>
            <Text style={styles.menuIcon}>🗑️</Text>
            <Text style={[styles.menuText, styles.dangerText]}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>PawPal v1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.md },
  title: { color: COLORS.text, fontSize: FONT_SIZE.xxl, fontWeight: '700', marginTop: SPACING.md, marginBottom: SPACING.lg },
  profileCard: { alignItems: 'center', marginBottom: SPACING.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  avatarText: { fontSize: 36 },
  name: { color: COLORS.text, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  joinDate: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, marginTop: 2 },
  premiumBadge: { backgroundColor: COLORS.warning + '20', paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: BORDER_RADIUS.full, marginTop: SPACING.sm },
  premiumText: { color: COLORS.warning, fontSize: FONT_SIZE.xs, fontWeight: '700', letterSpacing: 1 },
  statsRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  section: { marginTop: SPACING.lg },
  sectionTitle: { color: COLORS.text, fontSize: FONT_SIZE.lg, fontWeight: '700', marginBottom: SPACING.sm },
  petItem: { marginRight: SPACING.md },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  upgradeBtnIcon: { fontSize: 24, marginRight: SPACING.md },
  upgradeBtnContent: { flex: 1 },
  upgradeBtnTitle: { color: COLORS.primary, fontSize: FONT_SIZE.lg, fontWeight: '700' },
  upgradeBtnSubtitle: { color: COLORS.textSecondary, fontSize: FONT_SIZE.xs },
  upgradeBtnPrice: { color: COLORS.primary, fontSize: FONT_SIZE.lg, fontWeight: '700' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuIcon: { fontSize: 20, marginRight: SPACING.md },
  menuText: { color: COLORS.text, fontSize: FONT_SIZE.md, fontWeight: '500' },
  dangerItem: { borderColor: COLORS.error + '20' },
  dangerText: { color: COLORS.error },
  version: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs, textAlign: 'center', marginTop: SPACING.lg },
});
