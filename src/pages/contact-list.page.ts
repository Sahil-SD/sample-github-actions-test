import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';
import { TableComponent } from './components/table.component';
import { UI_ROUTES } from '../config/environment.config';
import { ContactListLocators } from '../locators/contact-list.locators';

export interface ContactRowData {
  name: string;
  birthdate: string;
  email: string;
  phone: string;
  address: string;
  cityStatePostal: string;
  country: string;
}

export class ContactListPage extends BasePage {
  protected readonly pageUrl = UI_ROUTES.CONTACT_LIST;
  protected readonly pageTitle = 'Contact List';

  // Locator references from centralized locators
  private readonly locators = ContactListLocators;

  // Components
  readonly header: HeaderComponent;
  readonly contactTable: TableComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.contactTable = new TableComponent(page, this.locators.TABLE.CONTAINER);
  }

  // Locator getters
  get addContactButton(): Locator {
    return this.getLocator(this.locators.BUTTONS.ADD_CONTACT);
  }

  get contactRows(): Locator {
    return this.getLocator(this.locators.TABLE.ROWS);
  }

  get pageHeading(): Locator {
    return this.getLocator(this.locators.HEADER.PAGE_HEADING);
  }

  get logoutButton(): Locator {
    return this.getLocator(this.locators.HEADER.LOGOUT_BUTTON);
  }

  // Actions
  async clickAddContact(): Promise<void> {
    this.logger.info('Clicking Add Contact button');
    await this.click(this.addContactButton);
    await this.page.waitForURL(/addContact/);
  }

  async getContactCount(): Promise<number> {
    return await this.contactRows.count();
  }

  async isContactListEmpty(): Promise<boolean> {
    const count = await this.getContactCount();
    return count === 0;
  }

  async clickContactByName(name: string): Promise<void> {
    this.logger.info(`Clicking contact: ${name}`);
    const contactRow = this.getLocator(this.locators.TABLE.ROW_BY_NAME(name));
    await contactRow.click();
    await this.page.waitForURL(/contactDetails/);
  }

  async getContactRowData(rowIndex: number): Promise<ContactRowData> {
    const row = this.contactRows.nth(rowIndex);

    return {
      name: (await row.locator(this.locators.CELLS.NAME).textContent()) || '',
      birthdate: (await row.locator(this.locators.CELLS.BIRTHDATE).textContent()) || '',
      email: (await row.locator(this.locators.CELLS.EMAIL).textContent()) || '',
      phone: (await row.locator(this.locators.CELLS.PHONE).textContent()) || '',
      address: (await row.locator(this.locators.CELLS.ADDRESS).textContent()) || '',
      cityStatePostal: (await row.locator(this.locators.CELLS.CITY_STATE_POSTAL).textContent()) || '',
      country: (await row.locator(this.locators.CELLS.COUNTRY).textContent()) || '',
    };
  }

  async getAllContactNames(): Promise<string[]> {
    const rows = await this.contactRows.all();
    const names: string[] = [];
    for (const row of rows) {
      const nameCell = row.locator(this.locators.CELLS.NAME);
      names.push((await nameCell.textContent()) || '');
    }
    return names;
  }

  async searchContactByName(name: string): Promise<boolean> {
    const names = await this.getAllContactNames();
    return names.some(n => n.includes(name));
  }

  async logout(): Promise<void> {
    await this.header.clickLogout();
    await this.page.waitForURL(/login|\/$/);
  }

  async waitForContactsLoaded(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }

  async getContactByIndex(index: number): Promise<Locator> {
    return this.getLocator(this.locators.TABLE.ROW_BY_INDEX(index));
  }
}