import { Page, Locator, expect } from '@playwright/test';

export class CheckoutInformationPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);

    // WebKit occasionally clears an already-filled field when a later field is filled.
    // Verify all three after the fact and re-fill any that reverted.
    await this.ensureFieldValue(this.firstNameInput, firstName);
    await this.ensureFieldValue(this.lastNameInput, lastName);
    await this.ensureFieldValue(this.postalCodeInput, postalCode);
  }

  private async ensureFieldValue(field: Locator, value: string) {
    if ((await field.inputValue()) !== value) {
      await field.fill(value);
    }
    await expect(field).toHaveValue(value);
  }

  async continue() {
    await this.continueButton.click();
  }
}
