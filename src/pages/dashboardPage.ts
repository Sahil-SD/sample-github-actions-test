import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class DashboardPage extends BasePage {
  readonly inventoryContainer: Locator;
  readonly productItem: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutOption: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.productItem = page.locator('[data-test="inventory-item"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.menuButton = page.locator('button[id="react-burger-menu-btn"]');
    this.logoutOption = page.locator('[data-test="logout-sidebar-link"]');
  }

  async verifyDashboardLoaded(): Promise<void> {
    await this.verifyElementVisible(this.inventoryContainer);
  }

  async getProductCount(): Promise<number> {
    return await this.productItem.count();
  }

  async addProductToCart(index: number = 0): Promise<void> {
    const addButton: Locator = this.page.locator('button[data-test^="add-to-cart"]').nth(index);
    await this.click(addButton);
  }

  async removeProductFromCart(index: number = 0): Promise<void> {
    const removeButton: Locator = this.page.locator('button[data-test^="remove"]').nth(index);
    await this.click(removeButton);
  }

  async getCartItemsCount(): Promise<string> {
    return await this.getText(this.cartBadge);
  }

  async goToCart(): Promise<void> {
    await this.click(this.page.locator('[data-test="shopping-cart-link"]'));
  }

  async logout(): Promise<void> {
    await this.click(this.menuButton);
    await this.click(this.logoutOption);
  }

  async sortBy(option: string): Promise<void> {
    await this.selectOption(this.sortDropdown, option);
  }
}