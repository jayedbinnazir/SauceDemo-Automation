import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutInformationPage } from '../../pages/CheckoutInformationPage';

test.describe('Checkout - Customer Information', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addProductToCart(0);
    await inventoryPage.goToCart();
    await cartPage.startCheckout();
  });

  test('should start checkout and display the customer information form', async ({ page }) => {
    const checkoutInformationPage = new CheckoutInformationPage(page);

    await expect(page).toHaveURL(/checkout-step-one.html/);
    await expect(checkoutInformationPage.firstNameInput).toBeVisible();
    await expect(checkoutInformationPage.lastNameInput).toBeVisible();
    await expect(checkoutInformationPage.postalCodeInput).toBeVisible();
  });

  test('should proceed to the overview page with valid customer information', async ({ page }) => {
    const checkoutInformationPage = new CheckoutInformationPage(page);

    await checkoutInformationPage.fillInformation('John', 'Doe', '12345');
    await checkoutInformationPage.continue();

    await expect(page).toHaveURL(/checkout-step-two.html/);
  });

  test('should show a required-field error when first name is missing', async ({ page }) => {
    const checkoutInformationPage = new CheckoutInformationPage(page);

    await checkoutInformationPage.fillInformation('', 'Doe', '12345');
    await checkoutInformationPage.continue();

    await expect(checkoutInformationPage.errorMessage).toBeVisible();
    await expect(checkoutInformationPage.errorMessage).toHaveText('Error: First Name is required');
  });

  test('should show a required-field error when postal code is missing', async ({ page }) => {
    const checkoutInformationPage = new CheckoutInformationPage(page);

    await checkoutInformationPage.fillInformation('John', 'Doe', '');
    await checkoutInformationPage.continue();

    await expect(checkoutInformationPage.errorMessage).toBeVisible();
    await expect(checkoutInformationPage.errorMessage).toHaveText('Error: Postal Code is required');
  });
});
