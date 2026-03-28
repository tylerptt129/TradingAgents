import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { PetAvatar } from '../../src/components/PetAvatar';
import { CareActionButton } from '../../src/components/CareActionButton';
import { StatBubble } from '../../src/components/StatBubble';
import { InfoCard } from '../../src/components/InfoCard';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, PET_TYPE_EMOJIS, MOOD_CONFIG } from '../../src/constants/theme';
import { getGreeting, getPetAge, formatDate, formatTime, getUpcomingAppointments } from '../../src/utils/helpers';

export default function HomeScreen() {
  const {
    profile,
    pets,
    selectedPetId,
    selectPet,
    feedingSchedules,
    vetAppointments,
    journal,
    careLog,
    logCare,
  } = useApp();
  const router = useRouter();

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const petFeedings = feedingSchedules.filter((f) => f.petId === selectedPetId);
  const upcomingVet = getUpcomingAppointments(vetAppointments).filter(
    (a) => a.petId === selectedPetId,
  );
  const recentJournal = journal
    .filter((j) => j.petId === selectedPetId)
    .slice(0, 3);

  const todaysCare = careLog.filter(
    (c) => c.petId === selectedPetId && c.date === new Date().toISOString().split('T')[0],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.name}>{profile.name} 🐾</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakCount}>{profile.careStreak}</Text>
          </View>
        </View>

        {/* Pet Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.petSelector}
          contentContainerStyle={styles.petSelectorContent}
        >
          {pets.map((pet) => (
            <View key={pet.id} style={styles.petAvatarWrap}>
              <PetAvatar
                name={pet.name}
                petType={pet.type}
                photoUri={pet.photoUri}
                size={56}
                color={pet.color}
                selected={pet.id === selectedPetId}
                onPress={() => selectPet(pet.id)}
              />
            </View>
          ))}
          <TouchableOpacity
            style={styles.addPetBtn}
            onPress={() => router.push('/pet/add')}
          >
            <Text style={styles.addPetPlus}>+</Text>
            <Text style={styles.addPetLabel}>Add</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* No pets state */}
        {!selectedPet ? (
          <TouchableOpacity
            style={styles.emptyCard}
            onPress={() => router.push('/pet/add')}
          >
            <Text style={styles.emptyIcon}>🐾</Text>
            <Text style={styles.emptyTitle}>Add Your First Pet</Text>
            <Text style={styles.emptySubtitle}>
              Start tracking your fur baby's health, meals, and memories!
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            {/* Pet Info Banner */}
            <View style={[styles.petBanner, { backgroundColor: selectedPet.color + '12' }]}>
              <View style={styles.petBannerLeft}>
                <Text style={styles.petBannerName}>{selectedPet.name}</Text>
                <Text style={styles.petBannerBreed}>
                  {selectedPet.breed} · {getPetAge(selectedPet.birthday)}
                </Text>
                {selectedPet.weight && (
                  <Text style={styles.petBannerWeight}>{selectedPet.weight} lbs</Text>
                )}
              </View>
              <Text style={styles.petBannerEmoji}>
                {PET_TYPE_EMOJIS[selectedPet.type]}
              </Text>
            </View>

            {/* Quick Care Actions */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsRow}>
              <CareActionButton
                emoji="🍖"
                label="Fed"
                color="#FF6B4A"
                onPress={() => logCare(selectedPet.id, 'feeding')}
              />
              <CareActionButton
                emoji="🚶"
                label="Walk"
                color="#4ECDC4"
                onPress={() => logCare(selectedPet.id, 'walk')}
              />
              <CareActionButton
                emoji="🎾"
                label="Play"
                color="#FFD93D"
                onPress={() => logCare(selectedPet.id, 'play')}
              />
              <CareActionButton
                emoji="🛁"
                label="Bath"
                color="#2196F3"
                onPress={() => logCare(selectedPet.id, 'bath')}
              />
            </View>

            {/* Today's Activity */}
            {todaysCare.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today's Activity</Text>
                {todaysCare.map((care) => (
                  <InfoCard
                    key={care.id}
                    emoji={care.type === 'feeding' ? '🍖' : care.type === 'walk' ? '🚶' : care.type === 'play' ? '🎾' : '🛁'}
                    title={care.type.charAt(0).toUpperCase() + care.type.slice(1)}
                    subtitle={formatTime(care.time)}
                  />
                ))}
              </View>
            )}

            {/* Stats */}
            <View style={styles.statsRow}>
              <StatBubble emoji="🔥" value={`${profile.careStreak}d`} label="Streak" color={COLORS.primary} />
              <StatBubble emoji="🏥" value={`${profile.totalVetVisits}`} label="Vet Visits" color={COLORS.secondary} />
              <StatBubble emoji="📝" value={`${profile.totalJournalEntries}`} label="Entries" color={COLORS.accent} />
            </View>

            {/* Upcoming Vet */}
            {upcomingVet.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upcoming Vet Visits</Text>
                {upcomingVet.slice(0, 2).map((apt) => (
                  <InfoCard
                    key={apt.id}
                    emoji="🏥"
                    title={apt.reason}
                    subtitle={`${formatDate(apt.date)} at ${formatTime(apt.time)}`}
                    rightText={apt.vetName}
                  />
                ))}
              </View>
            )}

            {/* Recent Journal */}
            {recentJournal.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Journal</Text>
                  <TouchableOpacity onPress={() => router.push('/journal' as any)}>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>
                {recentJournal.map((entry) => (
                  <InfoCard
                    key={entry.id}
                    emoji={MOOD_CONFIG[entry.mood]?.emoji || '📝'}
                    title={entry.note.slice(0, 50)}
                    subtitle={formatDate(entry.date)}
                  />
                ))}
              </View>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  greeting: { color: COLORS.textSecondary, fontSize: FONT_SIZE.md },
  name: { color: COLORS.text, fontSize: FONT_SIZE.xxl, fontWeight: '700' },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '12',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  streakIcon: { fontSize: 18, marginRight: 4 },
  streakCount: { color: COLORS.primary, fontSize: FONT_SIZE.lg, fontWeight: '700' },
  petSelector: { marginBottom: SPACING.md },
  petSelectorContent: { paddingRight: SPACING.md, gap: SPACING.md },
  petAvatarWrap: { marginRight: 4 },
  addPetBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPetPlus: { color: COLORS.textMuted, fontSize: 22, fontWeight: '300' },
  addPetLabel: { color: COLORS.textMuted, fontSize: 9 },
  petBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  petBannerLeft: {},
  petBannerName: { color: COLORS.text, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  petBannerBreed: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, marginTop: 2 },
  petBannerWeight: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, marginTop: 2 },
  petBannerEmoji: { fontSize: 48 },
  actionsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  section: { marginBottom: SPACING.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: COLORS.text, fontSize: FONT_SIZE.lg, fontWeight: '700', marginBottom: SPACING.sm },
  seeAll: { color: COLORS.primary, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  statsRow: { flexDirection: 'row', marginBottom: SPACING.lg },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    marginTop: SPACING.xl,
  },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.sm },
  emptyTitle: { color: COLORS.text, fontSize: FONT_SIZE.xl, fontWeight: '700', marginBottom: 4 },
  emptySubtitle: { color: COLORS.textSecondary, fontSize: FONT_SIZE.md, textAlign: 'center' },
});
