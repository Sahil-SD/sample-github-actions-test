import { Page, Locator } from '@playwright/test';
import { createLogger } from '../../core/logger/logger';
import { CommonLocators } from '../../locators/common.locators';

export class TableComponent {
  private page: Page;
  private tableSelector: string;
  private logger = createLogger('TableComponent');

  // Locator references
  private readonly locators = CommonLocators.TABLE;

  constructor(page: Page, tableSelector: string = CommonLocators.TABLE.CONTAINER) {
    this.page = page;
    this.tableSelector = tableSelector;
  }

  // Locator getters
  get table(): Locator {
    return this.page.locator(this.tableSelector);
  }

  get rows(): Locator {
    return this.table.locator(this.locators.ROW);
  }

  get headers(): Locator {
    return this.table.locator(this.locators.HEADER_CELL);
  }

  get body(): Locator {
    return this.table.locator(this.locators.BODY);
  }

  // Actions
  async getRowCount(): Promise<number> {
    return await this.rows.count();
  }

  async getCellValue(row: number, column: number): Promise<string> {
    const cellSelector = `${this.locators.ROW}:nth-child(${row}) ${this.locators.CELL}:nth-child(${column})`;
    const cell = this.table.locator(cellSelector);
    return (await cell.textContent()) || '';
  }

  async getRowByText(text: string): Promise<Locator> {
    return this.table.locator(`${this.locators.ROW}:has-text("${text}")`);
  }

  async clickRowByText(text: string): Promise<void> {
    this.logger.info(`Clicking row with text: ${text}`);
    const row = await this.getRowByText(text);
    await row.click();
  }

  async getAllRowTexts(): Promise<string[]> {
    const rows = await this.rows.all();
    const texts: string[] = [];
    for (const row of rows) {
      texts.push((await row.textContent()) || '');
    }
    return texts;
  }

  async getColumnValues(columnIndex: number): Promise<string[]> {
    const cells = this.body.locator(`${this.locators.ROW} ${this.locators.CELL}:nth-child(${columnIndex})`);
    const values: string[] = [];
    const count = await cells.count();
    for (let i = 0; i < count; i++) {
      values.push((await cells.nth(i).textContent()) || '');
    }
    return values;
  }
}