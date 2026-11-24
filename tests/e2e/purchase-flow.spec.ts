import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutInformationPage } from '../../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage';

test.describe('End-to-End - Purchase Workflow', () => {
  test('should complete a full purchase workflow from login to order confirmation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    // Login
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory.html/);

    // Browse and add products to cart
    const expectedNames = (await inventoryPage.getItemNames()).slice(0, 2);
    await inventoryPage.addProductToCart(0);
    await inventoryPage.addProductToCart(1);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    // Review cart
    await inventoryPage.goToCart();
    await expect(cartPage.cartItems).toHaveCount(2);
    expect(await cartPage.getItemNames()).toEqual(expectedNames);

    // Checkout - customer information
    await cartPage.startCheckout();
    await checkoutInformationPage.fillInformation('John', 'Doe', '12345');
    await checkoutInformationPage.continue();

    // Checkout - order overview
    await expect(page).toHaveURL(/checkout-step-two.html/);
    const subtotal = await checkoutOverviewPage.getSubtotal();
    const tax = await checkoutOverviewPage.getTax();
    const total = await checkoutOverviewPage.getTotal();
    expect(total).toBeCloseTo(subtotal + tax, 2);

    // Complete the order
    await checkoutOverviewPage.finish();

    // Verify final order confirmation
    await expect(page).toHaveURL(/checkout-complete.html/);
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutCompletePage.completeText).toBeVisible();
  });

  test('should require re-authentication after logout (regression)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory.html/);

    await inventoryPage.logout();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.loginButton).toBeVisible();

    // Direct navigation to a protected page without a session should bounce back to login
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: You can only access \'/inventory.html\' when you are logged in.'
    );
  });
});
