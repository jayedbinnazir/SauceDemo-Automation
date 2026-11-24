import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Shopping Cart - Manage Multiple Products', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('should add multiple products and update the cart badge accordingly', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart(0);
    await inventoryPage.addProductToCart(1);
    await inventoryPage.addProductToCart(2);

    await expect(inventoryPage.cartBadge).toHaveText('3');
  });

  test('should remove a product from the cart and update the badge', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart(0);
    await inventoryPage.addProductToCart(1);
    await inventoryPage.goToCart();

    await cartPage.removeItem(0);

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('should display the correct remaining product after removal', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    const names = await inventoryPage.getItemNames();
    const [firstName, secondName] = names;

    await inventoryPage.addProductToCart(0);
    await inventoryPage.addProductToCart(1);
    await inventoryPage.goToCart();

    await cartPage.removeItem(0);

    await expect(cartPage.cartItems).toHaveCount(1);
    expect(await cartPage.getItemNames()).toEqual([secondName]);
    expect(await cartPage.getItemNames()).not.toContain(firstName);
  });
});
