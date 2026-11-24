import { Page, Locator } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async goBackHome() {
    await this.backHomeButton.click();
  }
}
