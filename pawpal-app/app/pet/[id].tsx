import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { StatBubble } from '../../src/components/StatBubble';
import { InfoCard } from '../../src/components/InfoCard';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, PET_TYPE_EMOJIS } from '../../src/constants/theme';
import { getPetAge, formatDate, formatCurrency } from '../../src/utils/helpers';

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { pets, deletePet, vetAppointments, journal, careLog, weightLog, feedingSchedules } = useApp();

  const pet = pets.find((p) => p.id === id);

  if (!pet) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Pet not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const petVet = vetAppointments.filter((a) => a.petId === id);
  const petJournal = journal.filter((j) => j.petId === id);
  const petCare = careLog.filter((c) => c.petId === id);
  const petWeights = weightLog.filter((w) => w.petId === id);
  const petFeedings = feedingSchedules.filter((f) => f.petId === id);
  const totalVetCost = petVet.filter((a) => a.cost).reduce((sum, a) => sum + (a.cost || 0), 0);

  const handleDelete = () => {
    Alert.alert(
      `Remove ${pet.name}?`,
      'This will delete all data for this pet. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => { deletePet(pet.id); router.back(); } },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pet.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: pet.color + '15' }]}>
          <Text style={styles.heroEmoji}>{PET_TYPE_EMOJIS[pet.type]}</Text>
          <Text style={styles.heroName}>{pet.name}</Text>
          <Text style={styles.heroBreed}>{pet.breed} · {pet.gender}</Text>
          <Text style={styles.heroAge}>{getPetAge(pet.birthday)}</Text>
          {pet.weight && <Text style={styles.heroWeight}>{pet.weight} lbs</Text>}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBubble emoji="🏥" value={`${petVet.length}`} label="Vet Visits" color={COLORS.secondary} />
          <StatBubble emoji="📝" value={`${petJournal.length}`} label="Journal" color={COLORS.accent} />
          <StatBubble emoji="🐾" value={`${petCare.length}`} label="Activities" color={COLORS.primary} />
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <InfoCard emoji="🎂" title="Birthday" subtitle={formatDate(pet.birthday)} />
          <InfoCard emoji="🏠" title="Adopted" subtitle={formatDate(pet.adoptedDate)} />
          {pet.microchipId && <InfoCard emoji="🔖" title="Microchip" subtitle={pet.microchipId} />}
          {totalVetCost > 0 && (
            <InfoCard emoji="💰" title="Total Vet Costs" subtitle={formatCurrency(totalVetCost)} />
          )}
        </View>

        {/* Feeding Schedules */}
        {petFeedings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Feeding Schedule</Text>
            {petFeedings.map((f) => (
              <InfoCard
                key={f.id}
                emoji="🍖"
                title={f.name}
                subtitle={`${f.foodType} · ${f.amount}`}
                rightText={f.time}
              />
            ))}
          </View>
        )}

        {/* Weight History */}
        {petWeights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weight History</Text>
            {petWeights.slice(-5).reverse().map((w) => (
              <InfoCard
                key={w.id}
                emoji="⚖️"
                title={`${w.weight} lbs`}
                subtitle={formatDate(w.date)}
              />
            ))}
          </View>
        )}

        {/* Delete */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Remove {pet.name}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.sm },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: COLORS.text, fontSize: FONT_SIZE.lg, fontWeight: '600' },
  hero: { borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.lg },
  heroEmoji: { fontSize: 64, marginBottom: SPACING.sm },
  heroName: { color: COLORS.text, fontSize: FONT_SIZE.hero, fontWeight: '800' },
  heroBreed: { color: COLORS.textSecondary, fontSize: FONT_SIZE.md, marginTop: 4 },
  heroAge: { color: COLORS.text, fontSize: FONT_SIZE.xl, fontWeight: '700', marginTop: SPACING.sm },
  heroWeight: { color: COLORS.textSecondary, fontSize: FONT_SIZE.md },
  statsRow: { flexDirection: 'row', marginBottom: SPACING.lg },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { color: COLORS.text, fontSize: FONT_SIZE.lg, fontWeight: '700', marginBottom: SPACING.sm },
  deleteBtn: { paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.md },
  deleteText: { color: COLORS.error, fontSize: FONT_SIZE.md, fontWeight: '600' },
  errorText: { color: COLORS.text, fontSize: FONT_SIZE.lg, textAlign: 'center', marginTop: 100 },
  backLink: { color: COLORS.primary, fontSize: FONT_SIZE.md, textAlign: 'center', marginTop: SPACING.md },
});
