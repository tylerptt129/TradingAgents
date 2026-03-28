import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../src/context/AppContext';
import { PREMIUM_CONFIG } from '../src/constants/premium';
import { purchasePremium, restorePurchases } from '../src/services/purchases';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../src/constants/theme';

export default function PremiumScreen() {
  const router = useRouter();
  const { updateProfile } = useApp();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const result = await purchasePremium();
      if (result.success) {
        await updateProfile({ isPremium: true });
        Alert.alert('Welcome to Premium!', 'All features are now unlocked.', [
          { text: 'Awesome!', onPress: () => router.back() },
        ]);
      } else if (result.error && result.error !== 'cancelled') {
        Alert.alert('Purchase Failed', result.error);
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleRestore = async () => {
    setLoading(true);
    const restored = await restorePurchases();
    if (restored) {
      await updateProfile({ isPremium: true });
      Alert.alert('Restored!', 'Your premium access has been restored.', [
        { text: 'Great!', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('No Purchase Found', 'We couldn\'t find a previous purchase to restore.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>⚡</Text>
        <Text style={styles.heroTitle}>SaveQuest Premium</Text>
        <Text style={styles.heroSubtitle}>
          Unlock the full savings experience
        </Text>
      </View>

      {/* Feature comparison */}
      <View style={styles.features}>
        {PREMIUM_CONFIG.features.map((feature, i) => (
          <View key={i} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Price & Purchase */}
      <View style={styles.purchaseSection}>
        <Text style={styles.price}>{PREMIUM_CONFIG.price}</Text>
        <Text style={styles.priceSubtitle}>One-time purchase. Yours forever.</Text>

        <TouchableOpacity
          style={styles.purchaseBtn}
          onPress={handlePurchase}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.purchaseBtnText}>Unlock Premium</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restoreBtn}
          onPress={handleRestore}
          disabled={loading}
        >
          <Text style={styles.restoreBtnText}>Restore Purchase</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.legal}>
        Payment will be charged to your Apple ID account at confirmation of
        purchase. This is a one-time non-consumable purchase.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: SPACING.sm,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  heroIcon: {
    fontSize: 60,
    marginBottom: SPACING.md,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.hero,
    fontWeight: '800',
    textAlign: 'center',
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.lg,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  features: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  featureText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.md,
    flex: 1,
  },
  purchaseSection: {
    alignItems: 'center',
  },
  price: {
    color: COLORS.primary,
    fontSize: 48,
    fontWeight: '800',
  },
  priceSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.lg,
  },
  purchaseBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.full,
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  purchaseBtnText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  restoreBtn: {
    paddingVertical: SPACING.sm,
  },
  restoreBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textDecorationLine: 'underline',
  },
  legal: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
    marginTop: SPACING.xl,
    lineHeight: 16,
    paddingHorizontal: SPACING.md,
  },
});
