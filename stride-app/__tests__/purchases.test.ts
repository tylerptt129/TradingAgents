import { initializePurchases, purchasePremium, restorePurchases } from '../src/services/purchases';

describe('Purchase service (mock mode)', () => {
  it('initializePurchases resolves', async () => {
    await expect(initializePurchases()).resolves.toBeUndefined();
  });

  it('purchasePremium returns success in mock mode', async () => {
    const result = await purchasePremium();
    expect(result.success).toBe(true);
  });

  it('restorePurchases returns false in mock mode', async () => {
    const result = await restorePurchases();
    expect(result).toBe(false);
  });
});
