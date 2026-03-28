import { Platform } from 'react-native';
import { PREMIUM_CONFIG } from '../constants/premium';

const REVENUECAT_API_KEY = Platform.select({
  ios: 'YOUR_REVENUECAT_IOS_API_KEY',
  android: 'YOUR_REVENUECAT_ANDROID_API_KEY',
});

let isConfigured = false;

export async function initializePurchases(): Promise<void> {
  try {
    console.log('[Purchases] RevenueCat not yet configured, using mock mode');
  } catch (error) {
    console.warn('[Purchases] Failed to initialize:', error);
  }
}

export async function checkPremiumStatus(): Promise<boolean> {
  if (!isConfigured) return false;
  return false;
}

export async function purchasePremium(): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured) {
    return { success: true };
  }
  return { success: false, error: 'Not configured' };
}

export async function restorePurchases(): Promise<boolean> {
  if (!isConfigured) return false;
  return false;
}
