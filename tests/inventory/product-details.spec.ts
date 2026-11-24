import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { ProductDetailsPage } from '../../pages/ProductDetailsPage';

test.describe('Inventory - Product Details', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('should navigate to the product details page when a product is clicked', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    const expectedName = (await inventoryPage.getItemNames())[0];

    await inventoryPage.openProduct(0);

    await expect(page).toHaveURL(/inventory-item.html/);
    await expect(productDetailsPage.productName).toHaveText(expectedName);
  });

  test('should display matching product description and price on the details page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    const expectedPrice = (await inventoryPage.getItemPrices())[0];

    await inventoryPage.openProduct(0);

    await expect(productDetailsPage.productDescription).not.toBeEmpty();
    expect(await productDetailsPage.getPrice()).toBe(expectedPrice);
  });

  test('should navigate back to the inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    await inventoryPage.openProduct(0);
    await productDetailsPage.goBackToInventory();

    await expect(page).toHaveURL(/inventory.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });
});
