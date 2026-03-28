import { Platform } from 'react-native';

let isConfigured = false;

export async function initializePurchases(): Promise<void> {
  console.log('[Purchases] Mock mode — RevenueCat not configured');
}

export async function purchasePremium(): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured) return { success: true }; // Mock
  return { success: false, error: 'Not configured' };
}

export async function restorePurchases(): Promise<boolean> {
  return false;
}
