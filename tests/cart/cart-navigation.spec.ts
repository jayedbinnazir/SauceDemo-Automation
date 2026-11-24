import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Shopping Cart - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('should navigate to the cart page when clicking the cart icon', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart(0);
    await inventoryPage.goToCart();

    await expect(page).toHaveURL(/cart.html/);
  });

  test('should navigate back to the inventory page via Continue Shopping', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart(0);
    await inventoryPage.goToCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('should keep correct cart contents when viewing the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    const names = await inventoryPage.getItemNames();
    const prices = await inventoryPage.getItemPrices();

    await inventoryPage.addProductToCart(0);
    await inventoryPage.addProductToCart(1);
    await inventoryPage.goToCart();

    await expect(cartPage.cartItems).toHaveCount(2);
    expect(await cartPage.getItemNames()).toEqual([names[0], names[1]]);
    expect(await cartPage.getItemPrices()).toEqual([prices[0], prices[1]]);
  });
});
