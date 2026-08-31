import { test, expect } from '../../../src/core/fixtures/combined.fixture';
import { FakerProvider } from '../../../src/data/providers/faker-provider';

test.describe('View Contact Tests', () => {
  test('should view contact details', async ({
    contactListPage,
    addContactPage,
    contactDetailsPage,
    testLogger,
  }) => {
    testLogger.step(1, 'Create a contact');
    await contactListPage.navigate();
    await contactListPage.clickAddContact();

    const contact = FakerProvider.generateContact();
    await addContactPage.addContactAndWait(contact);

    testLogger.step(2, 'Click on contact to view details');
    const contactName = `${contact.firstName} ${contact.lastName}`;
    await contactListPage.clickContactByName(contactName);
    await contactDetailsPage.getPage().waitForTimeout(2000);

    testLogger.step(3, 'Verify contact details');
    const details = await contactDetailsPage.getContactDetails();
    expect(details.firstName).toBe(contact.firstName);
    expect(details.lastName).toBe(contact.lastName);
    expect(details.email).toBe(contact.email);
  });

  test('should return to contact list', async ({
    contactListPage,
    addContactPage,
    contactDetailsPage,
    testLogger,
  }) => {
    testLogger.step(1, 'Create and view a contact');
    await contactListPage.navigate();
    await contactListPage.clickAddContact();

    const contact = FakerProvider.generateContact();
    await addContactPage.addContactAndWait(contact);

    const contactName = `${contact.firstName} ${contact.lastName}`;
    await contactListPage.clickContactByName(contactName);

    testLogger.step(2, 'Click return button');
    await contactDetailsPage.clickReturn();

    testLogger.step(3, 'Verify return to contact list');
    await expect(contactListPage.getPage()).toHaveURL(/contactList/);
  });
});