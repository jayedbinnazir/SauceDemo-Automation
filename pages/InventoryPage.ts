import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async getItemNames(): Promise<string[]> {
    await expect(this.inventoryItems.first()).toBeVisible();
    return this.itemNames.allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    await expect(this.inventoryItems.first()).toBeVisible();
    const prices = await this.itemPrices.allTextContents();
    return prices.map((price) => parseFloat(price.replace('$', '')));
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async openProduct(index: number) {
    await this.itemNames.nth(index).click();
  }
}
