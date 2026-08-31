import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { UI_ROUTES } from '../config/environment.config';
import { ContactDetailsLocators } from '../locators/contact-details.locators';
import { Contact } from '../api/models/contact.model';

export class ContactDetailsPage extends BasePage {
  protected readonly pageUrl = UI_ROUTES.CONTACT_DETAILS;
  protected readonly pageTitle = 'Contact Details';

  // Locator references from centralized locators
  private readonly locators = ContactDetailsLocators;

  constructor(page: Page) {
    super(page);
  }

  // Field Locator getters
  get firstNameSpan(): Locator {
    return this.getLocator(this.locators.FIELDS.FIRST_NAME);
  }

  get lastNameSpan(): Locator {
    return this.getLocator(this.locators.FIELDS.LAST_NAME);
  }

  get birthdateSpan(): Locator {
    return this.getLocator(this.locators.FIELDS.BIRTHDATE);
  }

  get emailSpan(): Locator {
    return this.getLocator(this.locators.FIELDS.EMAIL);
  }

  get phoneSpan(): Locator {
    return this.getLocator(this.locators.FIELDS.PHONE);
  }

  get street1Span(): Locator {
    return this.getLocator(this.locators.FIELDS.STREET1);
  }

  get street2Span(): Locator {
    return this.getLocator(this.locators.FIELDS.STREET2);
  }

  get citySpan(): Locator {
    return this.getLocator(this.locators.FIELDS.CITY);
  }

  get stateSpan(): Locator {
    return this.getLocator(this.locators.FIELDS.STATE_PROVINCE);
  }

  get postalCodeSpan(): Locator {
    return this.getLocator(this.locators.FIELDS.POSTAL_CODE);
  }

  get countrySpan(): Locator {
    return this.getLocator(this.locators.FIELDS.COUNTRY);
  }

  // Button Locator getters
  get editButton(): Locator {
    return this.getLocator(this.locators.BUTTONS.EDIT);
  }

  get deleteButton(): Locator {
    return this.getLocator(this.locators.BUTTONS.DELETE);
  }

  get returnButton(): Locator {
    return this.getLocator(this.locators.BUTTONS.RETURN);
  }

  // Actions
  async getContactDetails(): Promise<Partial<Contact>> {
    this.logger.info('Getting contact details');
    return {
      firstName: await this.getText(this.firstNameSpan),
      lastName: await this.getText(this.lastNameSpan),
      birthdate: await this.getText(this.birthdateSpan),
      email: await this.getText(this.emailSpan),
      phone: await this.getText(this.phoneSpan),
      street1: await this.getText(this.street1Span),
      street2: await this.getText(this.street2Span),
      city: await this.getText(this.citySpan),
      stateProvince: await this.getText(this.stateSpan),
      postalCode: await this.getText(this.postalCodeSpan),
      country: await this.getText(this.countrySpan),
    };
  }

  async clickEdit(): Promise<void> {
    this.logger.info('Clicking Edit button');
    await this.click(this.editButton);
    await this.page.waitForURL(/editContact/);
  }

  async clickDelete(): Promise<void> {
    this.logger.info('Clicking Delete button');

    // Handle confirmation dialog
    this.page.once('dialog', async dialog => {
      this.logger.info(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });

    await this.click(this.deleteButton);
    await this.page.waitForURL(/contactList/);
    this.logger.info('Contact deleted successfully');
  }

  async clickReturn(): Promise<void> {
    this.logger.info('Clicking Return button');
    await this.click(this.returnButton);
    await this.page.waitForURL(/contactList/);
  }

  async getFullName(): Promise<string> {
    const firstName = await this.getText(this.firstNameSpan);
    const lastName = await this.getText(this.lastNameSpan);
    return `${firstName} ${lastName}`.trim();
  }

  async getFieldValue(fieldName: keyof typeof ContactDetailsLocators.FIELDS): Promise<string> {
    const selector = this.locators.FIELDS[fieldName];
    return await this.getTextBySelector(selector);
  }
}