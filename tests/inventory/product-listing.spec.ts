import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Inventory - Product Listing', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('should display the inventory page with Products heading visible', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await expect(page).toHaveURL(/inventory.html/);
    await expect(inventoryPage.pageTitle).toBeVisible();
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('should list all 6 products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('should display a valid name and price for every product', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    const names = await inventoryPage.getItemNames();
    const prices = await inventoryPage.getItemPrices();

    expect(names).toHaveLength(6);
    expect(prices).toHaveLength(6);

    for (const name of names) {
      expect(name.trim().length).toBeGreaterThan(0);
    }

    for (const price of prices) {
      expect(price).toBeGreaterThan(0);
    }
  });
});
