import { Platform } from 'react-native';
import { PREMIUM_CONFIG } from '../constants/premium';

/**
 * In-App Purchase service using RevenueCat.
 *
 * Setup steps before release:
 * 1. Create a RevenueCat account at https://www.revenuecat.com
 * 2. Create your app in RevenueCat dashboard
 * 3. Configure the product in App Store Connect:
 *    - Product ID: com.savequest.premium
 *    - Type: Non-Consumable
 *    - Price: $0.99
 * 4. Add your RevenueCat API key below
 * 5. Install: npx expo install react-native-purchases
 *
 * For now, this module provides a mock implementation that
 * works without RevenueCat configured, so the app can be
 * tested end-to-end before the store is set up.
 */

const REVENUECAT_API_KEY = Platform.select({
  ios: 'YOUR_REVENUECAT_IOS_API_KEY',
  android: 'YOUR_REVENUECAT_ANDROID_API_KEY',
});

let isConfigured = false;

export async function initializePurchases(): Promise<void> {
  try {
    // Uncomment when RevenueCat is configured:
    // const Purchases = require('react-native-purchases').default;
    // await Purchases.configure({ apiKey: REVENUECAT_API_KEY! });
    // isConfigured = true;
    console.log('[Purchases] RevenueCat not yet configured, using mock mode');
  } catch (error) {
    console.warn('[Purchases] Failed to initialize:', error);
  }
}

export async function checkPremiumStatus(): Promise<boolean> {
  if (!isConfigured) return false;

  try {
    // const Purchases = require('react-native-purchases').default;
    // const customerInfo = await Purchases.getCustomerInfo();
    // return customerInfo.entitlements.active['premium'] !== undefined;
    return false;
  } catch {
    return false;
  }
}

export async function purchasePremium(): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured) {
    // Mock purchase for development/testing
    return { success: true };
  }

  try {
    // const Purchases = require('react-native-purchases').default;
    // const offerings = await Purchases.getOfferings();
    // const premiumPackage = offerings.current?.availablePackages[0];
    // if (!premiumPackage) {
    //   return { success: false, error: 'No packages available' };
    // }
    // const { customerInfo } = await Purchases.purchasePackage(premiumPackage);
    // const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
    // return { success: isPremium };
    return { success: false, error: 'Not configured' };
  } catch (error: any) {
    if (error.userCancelled) {
      return { success: false, error: 'cancelled' };
    }
    return { success: false, error: error.message };
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!isConfigured) return false;

  try {
    // const Purchases = require('react-native-purchases').default;
    // const customerInfo = await Purchases.restorePurchases();
    // return customerInfo.entitlements.active['premium'] !== undefined;
    return false;
  } catch {
    return false;
  }
}
