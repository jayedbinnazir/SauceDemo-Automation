import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Shopping Cart - Add Single Product', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('should update the cart badge after adding a product', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await expect(inventoryPage.cartBadge).not.toBeVisible();

    await inventoryPage.addProductToCart(0);

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('should change the Add to cart button to Remove after adding', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart(0);

    await expect(inventoryPage.addToCartButtons.nth(0)).toHaveText('Remove');
  });

  test('should display the added product in the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    const expectedName = (await inventoryPage.getItemNames())[0];

    await inventoryPage.addProductToCart(0);
    await inventoryPage.goToCart();

    await expect(page).toHaveURL(/cart.html/);
    await expect(cartPage.cartItems).toHaveCount(1);
    expect(await cartPage.getItemNames()).toEqual([expectedName]);
  });
});
