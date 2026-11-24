import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Inventory - Product Sorting', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('should sort products by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getItemPrices();
    const sortedAscending = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sortedAscending);
  });

  test('should sort products by price high to low', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('hilo');

    const prices = await inventoryPage.getItemPrices();
    const sortedDescending = [...prices].sort((a, b) => b - a);

    expect(prices).toEqual(sortedDescending);
  });

  test('should keep product names correctly paired with prices after sorting', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('lohi');

    const names = await inventoryPage.getItemNames();
    const prices = await inventoryPage.getItemPrices();

    expect(names).toHaveLength(prices.length);
    expect(prices[0]).toBeLessThanOrEqual(prices[prices.length - 1]);
    expect(names[0]).toBe('Sauce Labs Onesie');
  });
});
