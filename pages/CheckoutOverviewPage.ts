import { Page, Locator } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async getItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const prices = await this.itemPrices.allTextContents();
    return prices.map((price) => parseFloat(price.replace('$', '')));
  }

  private async getLabelAmount(label: Locator): Promise<number> {
    const text = await label.textContent();
    return parseFloat((text ?? '').replace(/[^0-9.]/g, ''));
  }

  async getSubtotal(): Promise<number> {
    return this.getLabelAmount(this.subtotalLabel);
  }

  async getTax(): Promise<number> {
    return this.getLabelAmount(this.taxLabel);
  }

  async getTotal(): Promise<number> {
    return this.getLabelAmount(this.totalLabel);
  }

  async finish() {
    await this.finishButton.click();
  }
}
