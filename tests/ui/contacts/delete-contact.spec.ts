import { test, expect } from '../../../src/core/fixtures/combined.fixture';
import { FakerProvider } from '../../../src/data/providers/faker-provider';

test.describe('Delete Contact Tests', () => {
  test('should delete a contact', async ({
    contactListPage,
    addContactPage,
    contactDetailsPage,
    testLogger,
  }) => {
    testLogger.step(1, 'Create a contact to delete');
    await contactListPage.navigate();
    await contactListPage.clickAddContact();

    const contact = FakerProvider.generateContact();
    const contactName = `${contact.firstName} ${contact.lastName}`;
    await addContactPage.addContactAndWait(contact);

    testLogger.step(2, 'Get initial contact count');
    const initialCount = await contactListPage.getContactCount();

    testLogger.step(3, 'Open contact and delete');
    await contactListPage.clickContactByName(contactName);
    await contactDetailsPage.clickDelete();

    testLogger.step(4, 'Verify contact deleted');
    await contactListPage.waitForContactsLoaded();
    const finalCount = await contactListPage.getContactCount();
    expect(finalCount).toBe(initialCount - 1);

    testLogger.step(5, 'Verify contact no longer exists');
    const exists = await contactListPage.searchContactByName(contactName);
    expect(exists).toBeFalsy();
  });
});