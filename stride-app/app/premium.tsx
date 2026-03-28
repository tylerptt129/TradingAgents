import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { COLORS, GRADIENTS, SP, FS, RADIUS, CARD_SHADOW } from '../src/constants/theme';
import { PREMIUM_CONFIG } from '../src/constants/premium';
import { purchasePremium, restorePurchases } from '../src/services/purchases';

export default function PremiumScreen() {
  const { profile, updateProfile } = useApp();
  const router = useRouter();

  const handlePurchase = async () => {
    const result = await purchasePremium();
    if (result.success) {
      await updateProfile({ isPremium: true });
      Alert.alert('Welcome to Premium!', 'You now have access to all features. Enjoy Stride!', [
        { text: 'Awesome!', onPress: () => router.back() },
      ]);
    } else if (result.error) {
      Alert.alert('Purchase Failed', result.error);
    }
  };

  const handleRestore = async () => {
    const restored = await restorePurchases();
    if (restored) {
      await updateProfile({ isPremium: true });
      Alert.alert('Restored!', 'Your premium access has been restored.', [
        { text: 'Great!', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('No Purchases Found', 'We couldn\'t find any previous purchases.');
    }
  };

  if (profile.isPremium) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.alreadyPremium}>
          <Text style={styles.alreadyIcon}>✨</Text>
          <Text style={styles.alreadyTitle}>You're Premium!</Text>
          <Text style={styles.alreadyText}>You have full access to all features.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.doneBtn}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient
            colors={[GRADIENTS.violet[0] + '30', 'transparent']}
            style={styles.heroBg}
          />
          <Text style={styles.heroIcon}>⚡</Text>
          <Text style={styles.heroTitle}>Stride Premium</Text>
          <Text style={styles.heroSubtitle}>Unlock your full potential</Text>
        </View>

        {/* Premium features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionLabel}>EVERYTHING YOU GET</Text>
          {PREMIUM_CONFIG.features.map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <LinearGradient colors={GRADIENTS.violet} style={styles.featureCheck}>
                <Text style={styles.featureCheckText}>✓</Text>
              </LinearGradient>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Free features comparison */}
        <View style={styles.freeSection}>
          <Text style={styles.sectionLabel}>FREE PLAN INCLUDES</Text>
          {PREMIUM_CONFIG.freeFeatures.map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.freeCheck}>
                <Text style={styles.freeCheckText}>✓</Text>
              </View>
              <Text style={styles.freeText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Price card */}
        <View style={[styles.priceCard, CARD_SHADOW]}>
          <LinearGradient
            colors={GRADIENTS.violet}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.priceGradient}
          >
            <Text style={styles.priceLabel}>One-Time Purchase</Text>
            <Text style={styles.priceValue}>{PREMIUM_CONFIG.price}</Text>
            <Text style={styles.priceNote}>Pay once, keep forever</Text>
          </LinearGradient>
        </View>

        {/* Purchase button */}
        <TouchableOpacity activeOpacity={0.85} onPress={handlePurchase}>
          <LinearGradient
            colors={GRADIENTS.violet}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.purchaseBtn}
          >
            <Text style={styles.purchaseBtnText}>Unlock Premium — {PREMIUM_CONFIG.price}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Restore */}
        <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore}>
          <Text style={styles.restoreText}>Restore Purchase</Text>
        </TouchableOpacity>

        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeText}>Maybe Later</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  content: { paddingHorizontal: SP.lg, paddingBottom: 40 },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: SP.md,
    marginBottom: SP.md,
  },
  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: SP.xxl,
    overflow: 'hidden',
  },
  heroBg: { ...StyleSheet.absoluteFillObject },
  heroIcon: { fontSize: 56, marginBottom: SP.md },
  heroTitle: {
    color: COLORS.text,
    fontSize: FS.largeTitle,
    fontWeight: '800',
    letterSpacing: -1,
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FS.body,
    marginTop: SP.xs,
  },
  // Features
  featuresSection: { marginTop: SP.lg },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: SP.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SP.md,
  },
  featureCheck: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SP.md,
  },
  featureCheckText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  featureText: { color: COLORS.text, fontSize: FS.body, fontWeight: '500', flex: 1 },
  // Free features
  freeSection: { marginTop: SP.xl },
  freeCheck: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SP.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  freeCheckText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '800' },
  freeText: { color: COLORS.textSecondary, fontSize: FS.body, flex: 1 },
  // Price card
  priceCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginTop: SP.xl,
  },
  priceGradient: {
    padding: SP.xl,
    alignItems: 'center',
  },
  priceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FS.small, fontWeight: '600' },
  priceValue: { color: '#fff', fontSize: FS.hero, fontWeight: '800', letterSpacing: -2, marginVertical: SP.sm },
  priceNote: { color: 'rgba(255,255,255,0.7)', fontSize: FS.small },
  // Purchase button
  purchaseBtn: {
    borderRadius: RADIUS.lg,
    paddingVertical: SP.lg,
    alignItems: 'center',
    marginTop: SP.lg,
    ...CARD_SHADOW,
  },
  purchaseBtnText: { color: '#fff', fontSize: FS.headline, fontWeight: '800' },
  // Restore
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: SP.md,
    marginTop: SP.sm,
  },
  restoreText: { color: COLORS.primary, fontSize: FS.body, fontWeight: '600' },
  // Close
  closeBtn: {
    alignItems: 'center',
    paddingVertical: SP.sm,
  },
  closeText: { color: COLORS.textMuted, fontSize: FS.body },
  // Already premium
  alreadyPremium: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SP.xl,
  },
  alreadyIcon: { fontSize: 56, marginBottom: SP.md },
  alreadyTitle: { color: COLORS.text, fontSize: FS.title1, fontWeight: '800' },
  alreadyText: { color: COLORS.textSecondary, fontSize: FS.body, marginTop: SP.sm },
  doneBtn: {
    marginTop: SP.xl,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: SP.xl,
    paddingVertical: SP.md,
    borderRadius: RADIUS.lg,
  },
  doneBtnText: { color: COLORS.primary, fontSize: FS.headline, fontWeight: '700' },
});
