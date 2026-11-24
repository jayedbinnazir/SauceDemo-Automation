import { Page, Locator } from '@playwright/test';

export class ProductDetailsPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  async getPrice(): Promise<number> {
    const price = await this.productPrice.textContent();
    return parseFloat((price ?? '').replace('$', ''));
  }

  async goBackToInventory() {
    await this.backButton.click();
  }
}
