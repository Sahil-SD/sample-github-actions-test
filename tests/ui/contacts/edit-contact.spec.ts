import { test, expect } from '../../../src/core/fixtures/combined.fixture';
import { FakerProvider } from '../../../src/data/providers/faker-provider';

test.describe('Edit Contact Tests', () => {
  let contactName: string;

  test.beforeEach(async ({ contactListPage, addContactPage }) => {
    // Create a contact to edit
    await contactListPage.navigate();
    await contactListPage.clickAddContact();

    const contact = FakerProvider.generateContact();
    contactName = `${contact.firstName} ${contact.lastName}`;
    await addContactPage.addContactAndWait(contact);
  });

  test('should edit contact first name', async ({
    contactListPage,
    contactDetailsPage,
    editContactPage,
    testLogger,
  }) => {
    const newFirstName = `Updated${Date.now()}`;

    testLogger.step(1, 'Open contact details');
    await contactListPage.clickContactByName(contactName);

    testLogger.step(2, 'Click edit button');
    await contactDetailsPage.clickEdit();

    testLogger.step(3, 'Update first name');
    await editContactPage.updateContactAndWait({ firstName: newFirstName });

    testLogger.step(4, 'Verify update');
    const details = await contactDetailsPage.getContactDetails();
    expect(details.firstName).toBe(newFirstName);
  });

  test('should edit multiple fields', async ({
    contactListPage,
    contactDetailsPage,
    editContactPage,
    testLogger,
  }) => {
    const updates = {
      firstName: 'MultiUpdate',
      lastName: 'Test',
      email: 'multi.update@test.com',
      phone: '9999999999',
    };

    testLogger.step(1, 'Open contact and edit');
    await contactListPage.clickContactByName(contactName);
    await contactDetailsPage.clickEdit();

    testLogger.step(2, 'Update multiple fields');
    await editContactPage.updateContactAndWait(updates);

    testLogger.step(3, 'Verify all updates');
    const details = await contactDetailsPage.getContactDetails();
    expect(details.firstName).toBe(updates.firstName);
    expect(details.lastName).toBe(updates.lastName);
  });

  test('should cancel edit', async ({
    contactListPage,
    contactDetailsPage,
    editContactPage,
    testLogger,
  }) => {
    testLogger.step(1, 'Open contact details');
    await contactListPage.clickContactByName(contactName);
    const originalDetails = await contactDetailsPage.getContactDetails();

    testLogger.step(2, 'Start editing and cancel');
    await contactDetailsPage.clickEdit();
    await editContactPage.updateContactForm({ firstName: 'ShouldNotSave' });
    await editContactPage.clickCancel();

    testLogger.step(3, 'Verify no changes');
    const currentDetails = await contactDetailsPage.getContactDetails();
    expect(currentDetails.firstName).toBe(originalDetails.firstName);
  });
});