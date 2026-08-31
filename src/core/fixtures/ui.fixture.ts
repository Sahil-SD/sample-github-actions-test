import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { SignupPage } from '../../pages/signup.page';
import { ContactListPage } from '../../pages/contact-list.page';
import { AddContactPage } from '../../pages/add-contact.page';
import { ContactDetailsPage } from '../../pages/contact-details.page';
import { EditContactPage } from '../../pages/edit-contact.page';
import { UIKeywords, registerUIKeywords } from '../keywords/ui-keywords';
import { createLogger } from '../logger/logger';

const logger = createLogger('UIFixture');

export interface UIFixtures {
  loginPage: LoginPage;
  signupPage: SignupPage;
  contactListPage: ContactListPage;
  addContactPage: AddContactPage;
  contactDetailsPage: ContactDetailsPage;
  editContactPage: EditContactPage;
  uiKeywords: UIKeywords;
}

export const test = base.extend<UIFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  signupPage: async ({ page }, use) => {
    const signupPage = new SignupPage(page);
    await use(signupPage);
  },

  contactListPage: async ({ page }, use) => {
    const contactListPage = new ContactListPage(page);
    await use(contactListPage);
  },

  addContactPage: async ({ page }, use) => {
    const addContactPage = new AddContactPage(page);
    await use(addContactPage);
  },

  contactDetailsPage: async ({ page }, use) => {
    const contactDetailsPage = new ContactDetailsPage(page);
    await use(contactDetailsPage);
  },

  editContactPage: async ({ page }, use) => {
    const editContactPage = new EditContactPage(page);
    await use(editContactPage);
  },

  uiKeywords: async ({ page }, use) => {
    const keywords = registerUIKeywords(page);
    await use(keywords);
  },
});

export { expect } from '@playwright/test';