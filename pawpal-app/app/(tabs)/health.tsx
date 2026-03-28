import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { InfoCard } from '../../src/components/InfoCard';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../src/constants/theme';
import { formatDate, formatTime, getDaysUntil, isOverdue, getTodayStr, generateId } from '../../src/utils/helpers';

type Tab = 'vet' | 'vaccinations' | 'weight' | 'medications';

export default function HealthScreen() {
  const {
    selectedPetId,
    pets,
    vetAppointments,
    vaccinations,
    weightLog,
    medications,
    profile,
    addVetAppointment,
    completeVetAppointment,
    deleteVetAppointment,
    addVaccination,
    deleteVaccination,
    addWeightEntry,
    addMedication,
    deleteMedication,
  } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('vet');
  const [showAddVet, setShowAddVet] = useState(false);
  const [vetReason, setVetReason] = useState('');
  const [vetName, setVetName] = useState('');
  const [vetDate, setVetDate] = useState('');
  const [vetTime, setVetTime] = useState('09:00');

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const petVet = vetAppointments.filter((a) => a.petId === selectedPetId);
  const petVax = vaccinations.filter((v) => v.petId === selectedPetId);
  const petWeight = weightLog.filter((w) => w.petId === selectedPetId);
  const petMeds = medications.filter((m) => m.petId === selectedPetId);

  const handleAddVet = async () => {
    if (!vetReason || !vetDate || !selectedPetId) return;
    await addVetAppointment({
      petId: selectedPetId,
      vetName: vetName || 'Vet',
      reason: vetReason,
      date: vetDate,
      time: vetTime,
      completed: false,
    });
    setShowAddVet(false);
    setVetReason('');
    setVetName('');
    setVetDate('');
  };

  if (!selectedPet) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Health</Text>
        <Text style={styles.emptyText}>Add a pet first to track their health!</Text>
      </SafeAreaView>
    );
  }

  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: 'vet', label: 'Vet', emoji: '🏥' },
    { key: 'medications', label: 'Meds', emoji: '💊' },
    { key: 'vaccinations', label: 'Vaccines', emoji: '💉' },
    { key: 'weight', label: 'Weight', emoji: '⚖️' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{selectedPet.name}'s Health</Text>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <Text style={styles.tabEmoji}>{t.emoji}</Text>
              <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Vet Tab */}
        {tab === 'vet' && (
          <View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddVet(!showAddVet)}
            >
              <Text style={styles.addButtonText}>+ Add Vet Appointment</Text>
            </TouchableOpacity>

            {showAddVet && (
              <View style={styles.addForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Reason (e.g., Annual checkup)"
                  placeholderTextColor={COLORS.textMuted}
                  value={vetReason}
                  onChangeText={setVetReason}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Vet name"
                  placeholderTextColor={COLORS.textMuted}
                  value={vetName}
                  onChangeText={setVetName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Date (YYYY-MM-DD)"
                  placeholderTextColor={COLORS.textMuted}
                  value={vetDate}
                  onChangeText={setVetDate}
                />
                <TouchableOpacity style={styles.submitBtn} onPress={handleAddVet}>
                  <Text style={styles.submitBtnText}>Add Appointment</Text>
                </TouchableOpacity>
              </View>
            )}

            {petVet.length === 0 ? (
              <Text style={styles.emptyText}>No vet appointments yet</Text>
            ) : (
              petVet
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((apt) => {
                  const daysLeft = getDaysUntil(apt.date);
                  const overdue = isOverdue(apt.date) && !apt.completed;
                  return (
                    <InfoCard
                      key={apt.id}
                      emoji={apt.completed ? '✅' : overdue ? '⚠️' : '🏥'}
                      title={apt.reason}
                      subtitle={`${apt.vetName} · ${formatDate(apt.date)} at ${formatTime(apt.time)}`}
                      rightText={apt.completed ? 'Done' : overdue ? 'Overdue' : `${daysLeft}d`}
                      rightColor={apt.completed ? COLORS.success : overdue ? COLORS.error : COLORS.info}
                      onPress={
                        !apt.completed
                          ? () =>
                              Alert.alert('Complete Visit?', 'Mark this appointment as done?', [
                                { text: 'Cancel' },
                                { text: 'Complete', onPress: () => completeVetAppointment(apt.id) },
                              ])
                          : undefined
                      }
                      onDelete={() => deleteVetAppointment(apt.id)}
                    />
                  );
                })
            )}
          </View>
        )}

        {/* Medications Tab */}
        {tab === 'medications' && (
          <View>
            {!profile.isPremium ? (
              <TouchableOpacity
                style={styles.premiumGate}
                onPress={() => router.push('/premium')}
              >
                <Text style={styles.premiumGateEmoji}>💊</Text>
                <Text style={styles.premiumGateTitle}>Medication Tracking</Text>
                <Text style={styles.premiumGateText}>
                  Track medications, dosages, and get reminders. Upgrade to Premium!
                </Text>
                <View style={styles.premiumGateBtn}>
                  <Text style={styles.premiumGateBtnText}>Unlock for $1.99</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <>
                {petMeds.length === 0 ? (
                  <Text style={styles.emptyText}>No medications tracked</Text>
                ) : (
                  petMeds.map((med) => (
                    <InfoCard
                      key={med.id}
                      emoji="💊"
                      title={med.name}
                      subtitle={`${med.dosage} · ${med.frequency}`}
                      rightText={formatTime(med.time)}
                      onDelete={() => deleteMedication(med.id)}
                    />
                  ))
                )}
              </>
            )}
          </View>
        )}

        {/* Vaccinations Tab */}
        {tab === 'vaccinations' && (
          <View>
            {!profile.isPremium ? (
              <TouchableOpacity
                style={styles.premiumGate}
                onPress={() => router.push('/premium')}
              >
                <Text style={styles.premiumGateEmoji}>💉</Text>
                <Text style={styles.premiumGateTitle}>Vaccination Records</Text>
                <Text style={styles.premiumGateText}>
                  Track vaccinations with expiry alerts. Upgrade to Premium!
                </Text>
                <View style={styles.premiumGateBtn}>
                  <Text style={styles.premiumGateBtnText}>Unlock for $1.99</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <>
                {petVax.length === 0 ? (
                  <Text style={styles.emptyText}>No vaccinations recorded</Text>
                ) : (
                  petVax.map((vax) => {
                    const expired = vax.expiryDate && isOverdue(vax.expiryDate);
                    return (
                      <InfoCard
                        key={vax.id}
                        emoji={expired ? '⚠️' : '💉'}
                        title={vax.name}
                        subtitle={`Given: ${formatDate(vax.dateGiven)}${vax.expiryDate ? ` · Expires: ${formatDate(vax.expiryDate)}` : ''}`}
                        rightText={expired ? 'Expired' : undefined}
                        rightColor={expired ? COLORS.error : undefined}
                        onDelete={() => deleteVaccination(vax.id)}
                      />
                    );
                  })
                )}
              </>
            )}
          </View>
        )}

        {/* Weight Tab */}
        {tab === 'weight' && (
          <View>
            {!profile.isPremium ? (
              <TouchableOpacity
                style={styles.premiumGate}
                onPress={() => router.push('/premium')}
              >
                <Text style={styles.premiumGateEmoji}>⚖️</Text>
                <Text style={styles.premiumGateTitle}>Weight Tracking</Text>
                <Text style={styles.premiumGateText}>
                  Track weight history over time with charts. Upgrade to Premium!
                </Text>
                <View style={styles.premiumGateBtn}>
                  <Text style={styles.premiumGateBtnText}>Unlock for $1.99</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <>
                {petWeight.length === 0 ? (
                  <Text style={styles.emptyText}>No weight entries yet</Text>
                ) : (
                  <>
                    {/* Simple weight chart using bars */}
                    <View style={styles.weightChart}>
                      {petWeight.slice(-7).map((w, i) => {
                        const maxW = Math.max(...petWeight.slice(-7).map((e) => e.weight));
                        const height = maxW > 0 ? (w.weight / maxW) * 100 : 10;
                        return (
                          <View key={w.id} style={styles.weightBar}>
                            <Text style={styles.weightBarLabel}>{w.weight}</Text>
                            <View
                              style={[
                                styles.weightBarFill,
                                { height, backgroundColor: COLORS.secondary },
                              ]}
                            />
                            <Text style={styles.weightBarDate}>
                              {w.date.slice(5)}
                            </Text>
                          </View>
                        );
                      })}
                    </View>

                    {petWeight
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((w) => (
                        <InfoCard
                          key={w.id}
                          emoji="⚖️"
                          title={`${w.weight} lbs`}
                          subtitle={formatDate(w.date)}
                        />
                      ))}
                  </>
                )}
              </>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.md },
  title: { color: COLORS.text, fontSize: FONT_SIZE.xxl, fontWeight: '700', marginTop: SPACING.md, marginBottom: SPACING.md },
  tabBar: { marginBottom: SPACING.md },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.card,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  tabEmoji: { fontSize: 16, marginRight: 4 },
  tabLabel: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  tabLabelActive: { color: COLORS.primary },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  addButtonText: { color: '#fff', fontSize: FONT_SIZE.md, fontWeight: '700' },
  addForm: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: FONT_SIZE.md, fontWeight: '700' },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
  premiumGate: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    marginTop: SPACING.md,
  },
  premiumGateEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  premiumGateTitle: { color: COLORS.text, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  premiumGateText: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, textAlign: 'center', marginTop: 4, marginBottom: SPACING.md },
  premiumGateBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
  },
  premiumGateBtnText: { color: '#fff', fontWeight: '700', fontSize: FONT_SIZE.md },
  weightChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 140,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  weightBar: { alignItems: 'center', flex: 1 },
  weightBarLabel: { color: COLORS.text, fontSize: FONT_SIZE.xs, fontWeight: '600', marginBottom: 4 },
  weightBarFill: { width: 20, borderRadius: 4, minHeight: 4 },
  weightBarDate: { color: COLORS.textMuted, fontSize: 9, marginTop: 4 },
});
