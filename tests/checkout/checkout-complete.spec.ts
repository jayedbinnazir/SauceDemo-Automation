import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutInformationPage } from '../../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage';

test.describe('Checkout - Order Completion', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addProductToCart(0);
    await inventoryPage.goToCart();
    await cartPage.startCheckout();
    await checkoutInformationPage.fillInformation('John', 'Doe', '12345');
    await checkoutInformationPage.continue();
  });

  test('should complete the checkout and show the order confirmation', async ({ page }) => {
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    await checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/checkout-complete.html/);
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutCompletePage.completeText).toBeVisible();
  });

  test('should return to the inventory page with an empty cart after confirmation', async ({ page }) => {
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);
    const inventoryPage = new InventoryPage(page);

    await checkoutOverviewPage.finish();
    await checkoutCompletePage.goBackHome();

    await expect(page).toHaveURL(/inventory.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });
});
