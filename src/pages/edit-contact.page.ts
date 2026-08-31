import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { UI_ROUTES } from '../config/environment.config';
import { EditContactLocators } from '../locators/edit-contact.locators';
import { ContactUpdate } from '../api/models/contact.model';

export class EditContactPage extends BasePage {
  protected readonly pageUrl = UI_ROUTES.EDIT_CONTACT;
  protected readonly pageTitle = 'Edit Contact';

  // Locator references from centralized locators
  private readonly locators = EditContactLocators;

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
  async updateContactForm(contact: ContactUpdate): Promise<void> {
    this.logger.info('Updating contact form');

    if (contact.firstName !== undefined) {
      await this.clear(this.firstNameInput);
      await this.fill(this.firstNameInput, contact.firstName);
    }
    if (contact.lastName !== undefined) {
      await this.clear(this.lastNameInput);
      await this.fill(this.lastNameInput, contact.lastName);
    }
    if (contact.birthdate !== undefined) {
      await this.clear(this.birthdateInput);
      await this.fill(this.birthdateInput, contact.birthdate);
    }
    if (contact.email !== undefined) {
      await this.clear(this.emailInput);
      await this.fill(this.emailInput, contact.email);
    }
    if (contact.phone !== undefined) {
      await this.clear(this.phoneInput);
      await this.fill(this.phoneInput, contact.phone);
    }
    if (contact.street1 !== undefined) {
      await this.clear(this.street1Input);
      await this.fill(this.street1Input, contact.street1);
    }
    if (contact.street2 !== undefined) {
      await this.clear(this.street2Input);
      await this.fill(this.street2Input, contact.street2);
    }
    if (contact.city !== undefined) {
      await this.clear(this.cityInput);
      await this.fill(this.cityInput, contact.city);
    }
    if (contact.stateProvince !== undefined) {
      await this.clear(this.stateInput);
      await this.fill(this.stateInput, contact.stateProvince);
    }
    if (contact.postalCode !== undefined) {
      await this.clear(this.postalCodeInput);
      await this.fill(this.postalCodeInput, contact.postalCode);
    }
    if (contact.country !== undefined) {
      await this.clear(this.countryInput);
      await this.fill(this.countryInput, contact.country);
    }
  }

  async submitForm(): Promise<void> {
    this.logger.info('Submitting edit form');
    await this.click(this.submitButton);
  }

  async updateContact(contact: ContactUpdate): Promise<void> {
    await this.updateContactForm(contact);
    await this.submitForm();
  }

  async updateContactAndWait(contact: ContactUpdate): Promise<void> {
    await this.updateContact(contact);
    await this.page.waitForURL(/contactDetails/);
    this.logger.info('Contact updated successfully');
  }

  async clickCancel(): Promise<void> {
    this.logger.info('Clicking cancel button');
    await this.click(this.cancelButton);
    await this.page.waitForURL(/contactDetails/);
  }

  async getCurrentValues(): Promise<ContactUpdate> {
    return {
      firstName: await this.getValue(this.firstNameInput),
      lastName: await this.getValue(this.lastNameInput),
      birthdate: await this.getValue(this.birthdateInput),
      email: await this.getValue(this.emailInput),
      phone: await this.getValue(this.phoneInput),
      street1: await this.getValue(this.street1Input),
      street2: await this.getValue(this.street2Input),
      city: await this.getValue(this.cityInput),
      stateProvince: await this.getValue(this.stateInput),
      postalCode: await this.getValue(this.postalCodeInput),
      country: await this.getValue(this.countryInput),
    };
  }

  async getErrorText(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }
}