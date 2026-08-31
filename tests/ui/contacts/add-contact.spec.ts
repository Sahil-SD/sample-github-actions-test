import { test, expect } from '../../../src/core/fixtures/combined.fixture';
import { FakerProvider } from '../../../src/data/providers/faker-provider';
import { dataProvider } from '../../../src/data/providers/data-providers';

test.describe('Add Contact Tests', () => {
  test('should add contact with all fields', async ({
    contactListPage,
    addContactPage,
    testLogger,
  }) => {
    testLogger.step(1, 'Navigate to contact list');
    await contactListPage.navigate();

    testLogger.step(2, 'Click add contact');
    await contactListPage.clickAddContact();

    testLogger.step(3, 'Fill contact form with all fields');
    const contact = FakerProvider.generateContact();
    await addContactPage.addContactAndWait(contact);

    testLogger.step(4, 'Verify contact appears in list');
    await contactListPage.getPage().waitForTimeout(2000);
    const exists = await contactListPage.searchContactByName(
      `${contact.firstName} ${contact.lastName}`
    );
    expect(exists).toBeTruthy();
  });

  test('should add contact with required fields only', async ({
    contactListPage,
    addContactPage,
    testLogger,
  }) => {
    testLogger.step(1, 'Navigate to add contact page');
    await contactListPage.navigate();
    await contactListPage.clickAddContact();

    testLogger.step(2, 'Fill only required fields');
    const contact = {
      firstName: `Test${Date.now()}`,
      lastName: 'Required',
    };
    await addContactPage.addContactAndWait(contact);

    testLogger.step(3, 'Verify contact was added');
    const exists = await contactListPage.searchContactByName(
      `${contact.firstName} ${contact.lastName}`
    );
    expect(exists).toBeTruthy();
  });

  test('should validate required fields', async ({
    contactListPage,
    addContactPage,
    testLogger,
  }) => {
    testLogger.step(1, 'Navigate to add contact page');
    await contactListPage.navigate();
    await contactListPage.clickAddContact();

    testLogger.step(2, 'Submit empty form');
    await addContactPage.submitForm();

    testLogger.step(3, 'Verify error message');
    await expect(addContactPage.errorMessage).toBeVisible();
  });

  test('should cancel adding contact', async ({
    contactListPage,
    addContactPage,
    testLogger,
  }) => {
    testLogger.step(1, 'Get initial contact count');
    await contactListPage.navigate();
    const initialCount = await contactListPage.getContactCount();

    testLogger.step(2, 'Navigate to add contact and cancel');
    await contactListPage.clickAddContact();
    await addContactPage.clickCancel();

    testLogger.step(3, 'Verify contact count unchanged');
    const finalCount = await contactListPage.getContactCount();
    expect(finalCount).toBe(initialCount);
  });

  // Data-driven test with pairwise data
  const pairwiseData = dataProvider.getParameterizedContactData().slice(0, 5);

  for (const [testName, contactData] of pairwiseData) {
    test(`Pairwise: ${testName}`, async ({
      contactListPage,
      addContactPage,
      testLogger,
    }) => {
      testLogger.step(1, 'Navigate to add contact');
      await contactListPage.navigate();
      await contactListPage.clickAddContact();

      testLogger.step(2, `Add contact: ${JSON.stringify(contactData)}`);

      // Skip invalid data that would fail validation
      if (!contactData.firstName || !contactData.lastName) {
        await addContactPage.addContact(contactData);
        await expect(addContactPage.errorMessage).toBeVisible();
      } else {
        await addContactPage.addContactAndWait(contactData);
        await expect(contactListPage.getPage()).toHaveURL(/contactList/);
      }
    });
  }
});