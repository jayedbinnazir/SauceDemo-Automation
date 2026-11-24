import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutInformationPage } from '../../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage';

test.describe('Checkout - Order Overview', () => {
  let expectedNames: string[];
  let expectedPrices: number[];

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    expectedNames = (await inventoryPage.getItemNames()).slice(0, 2);
    expectedPrices = (await inventoryPage.getItemPrices()).slice(0, 2);

    await inventoryPage.addProductToCart(0);
    await inventoryPage.addProductToCart(1);
    await inventoryPage.goToCart();
    await cartPage.startCheckout();
    await checkoutInformationPage.fillInformation('John', 'Doe', '12345');
    await checkoutInformationPage.continue();
  });

  test('should display correct product names and prices on the overview page', async ({ page }) => {
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    await expect(page).toHaveURL(/checkout-step-two.html/);
    await expect(checkoutOverviewPage.cartItems).toHaveCount(2);
    expect(await checkoutOverviewPage.getItemNames()).toEqual(expectedNames);
    expect(await checkoutOverviewPage.getItemPrices()).toEqual(expectedPrices);
  });

  test('should calculate the item total as the sum of individual product prices', async ({ page }) => {
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    const expectedSubtotal = expectedPrices.reduce((sum, price) => sum + price, 0);
    const subtotal = await checkoutOverviewPage.getSubtotal();

    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
  });

  test('should calculate the total as subtotal plus tax', async ({ page }) => {
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    const subtotal = await checkoutOverviewPage.getSubtotal();
    const tax = await checkoutOverviewPage.getTax();
    const total = await checkoutOverviewPage.getTotal();

    expect(total).toBeCloseTo(subtotal + tax, 2);
  });
});
