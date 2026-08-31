import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { UI_ROUTES } from '../config/environment.config';
import { AddContactLocators } from '../locators/add-contact.locators';
import { ContactCreate } from '../api/models/contact.model';

export class AddContactPage extends BasePage {
  protected readonly pageUrl = UI_ROUTES.ADD_CONTACT;
  protected readonly pageTitle = 'Add Contact';

  // Locator references from centralized locators
  private readonly locators = AddContactLocators;

  constructor(page: Page) {
    super(page);
  }

  // Personal Information Locator getters
  get firstNameInput(): Locator {
    return this.getLocator(this.locators.INPUTS.FIRST_NAME);
  }

  get lastNameInput(): Locator {
    return this.getLocator(this.locators.INPUTS.LAST_NAME);
  }

  get birthdateInput(): Locator {
    return this.getLocator(this.locators.INPUTS.BIRTHDATE);
  }

  get emailInput(): Locator {
    return this.getLocator(this.locators.INPUTS.EMAIL);
  }

  get phoneInput(): Locator {
    return this.getLocator(this.locators.INPUTS.PHONE);
  }

  // Address Information Locator getters
  get street1Input(): Locator {
    return this.getLocator(this.locators.ADDRESS_INPUTS.STREET1);
  }

  get street2Input(): Locator {
    return this.getLocator(this.locators.ADDRESS_INPUTS.STREET2);
  }

  get cityInput(): Locator {
    return this.getLocator(this.locators.ADDRESS_INPUTS.CITY);
  }

  get stateInput(): Locator {
    return this.getLocator(this.locators.ADDRESS_INPUTS.STATE_PROVINCE);
  }

  get postalCodeInput(): Locator {
    return this.getLocator(this.locators.ADDRESS_INPUTS.POSTAL_CODE);
  }

  get countryInput(): Locator {
    return this.getLocator(this.locators.ADDRESS_INPUTS.COUNTRY);
  }

  // Button Locator getters
  get submitButton(): Locator {
    return this.getLocator(this.locators.BUTTONS.SUBMIT);
  }

  get cancelButton(): Locator {
    return this.getLocator(this.locators.BUTTONS.CANCEL);
  }

  get errorMessage(): Locator {
    return this.getLocator(this.locators.MESSAGES.ERROR);
  }

  // Actions
  async fillContactForm(contact: ContactCreate): Promise<void> {
    this.logger.info(`Filling contact form for: ${contact.firstName} ${contact.lastName}`);

    await this.fill(this.firstNameInput, contact.firstName);
    await this.fill(this.lastNameInput, contact.lastName);

    if (contact.birthdate) {
      await this.fill(this.birthdateInput, contact.birthdate);
    }
    if (contact.email) {
      await this.fill(this.emailInput, contact.email);
    }
    if (contact.phone) {
      await this.fill(this.phoneInput, contact.phone);
    }
    if (contact.street1) {
      await this.fill(this.street1Input, contact.street1);
    }
    if (contact.street2) {
      await this.fill(this.street2Input, contact.street2);
    }
    if (contact.city) {
      await this.fill(this.cityInput, contact.city);
    }
    if (contact.stateProvince) {
      await this.fill(this.stateInput, contact.stateProvince);
    }
    if (contact.postalCode) {
      await this.fill(this.postalCodeInput, contact.postalCode);
    }
    if (contact.country) {
      await this.fill(this.countryInput, contact.country);
    }
  }

  async submitForm(): Promise<void> {
    this.logger.info('Submitting contact form');
    await this.click(this.submitButton);
  }

  async addContact(contact: ContactCreate): Promise<void> {
    await this.fillContactForm(contact);
    await this.submitForm();
  }

  async addContactAndWait(contact: ContactCreate): Promise<void> {
    await this.addContact(contact);
    await this.page.waitForURL(/contactList/);
    this.logger.info('Contact added successfully');
  }

  async clickCancel(): Promise<void> {
    this.logger.info('Clicking cancel button');
    await this.click(this.cancelButton);
    await this.page.waitForURL(/contactList/);
  }

  async getErrorText(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }
}