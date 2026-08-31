import { test, expect } from '../../../src/core/fixtures/api.fixture';
import { TEST_USERS } from '../../../src/config/test-users.config';
import { FakerProvider } from '../../../src/data/providers/faker-provider';
import { Contact } from '../../../src/api/models/contact.model';

test.describe('Contacts API Tests', () => {
  test.beforeEach(async ({ authService }) => {
    const user = TEST_USERS.DEFAULT_USER;
    await authService.login({
      email: user.email,
      password: user.password,
    });
  });

  test('should create a new contact', async ({ contactService }) => {
    const contactData = FakerProvider.generateContact();

    const contact = await contactService.createContact(contactData);

    expect(contact._id).toBeDefined();
    expect(contact.firstName).toBe(contactData.firstName);
    expect(contact.lastName).toBe(contactData.lastName);

    // Cleanup
    await contactService.deleteContact(contact._id!);
  });

  test('should get all contacts', async ({ contactService }) => {
    const contacts = await contactService.getAllContacts();

    expect(Array.isArray(contacts)).toBeTruthy();
  });

  test('should get contact by ID', async ({ contactService }) => {
    // Create a contact first
    const contactData = FakerProvider.generateContact();
    const created = await contactService.createContact(contactData);

    // Get by ID
    const contact = await contactService.getContactById(created._id!);

    expect(contact._id).toBe(created._id);
    expect(contact.firstName).toBe(contactData.firstName);

    // Cleanup
    await contactService.deleteContact(created._id!);
  });

  test('should update a contact', async ({ contactService }) => {
    // Create a contact
    const contactData = FakerProvider.generateContact();
    const created = await contactService.createContact(contactData);

    // Update
    const updated = await contactService.updateContact(created._id!, {
      firstName: 'UpdatedName',
    });

    expect(updated.firstName).toBe('UpdatedName');

    // Cleanup
    await contactService.deleteContact(created._id!);
  });

  test('should delete a contact', async ({ contactService }) => {
    // Create a contact
    const contactData = FakerProvider.generateContact();
    const created = await contactService.createContact(contactData);

    // Delete
    await contactService.deleteContact(created._id!);

    // Verify deleted
    await expect(
      contactService.getContactById(created._id!)
    ).rejects.toThrow();
  });
});