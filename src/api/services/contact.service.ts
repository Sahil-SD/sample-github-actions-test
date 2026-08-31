import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { Contact, ContactCreate, ContactUpdate, ContactListResponse } from '../models/contact.model';
import { RequestBuilder } from '../../core/api/request-builder';

export class ContactService extends BaseService {
  constructor(requestBuilder: RequestBuilder) {
    super(requestBuilder);
  }

  async getAllContacts(): Promise<ContactListResponse> {
    this.logger.info('Fetching all contacts');
    return this.requestBuilder.get<ContactListResponse>(API_ENDPOINTS.CONTACTS.LIST);
  }

  async getContactById(id: string): Promise<Contact> {
    this.logger.info('Fetching contact by ID', { id });
    return this.requestBuilder.get<Contact>(API_ENDPOINTS.CONTACTS.GET(id));
  }

  async createContact(contactData: ContactCreate): Promise<Contact> {
    this.logger.info('Creating new contact', {
      name: `${contactData.firstName} ${contactData.lastName}`
    });
    const response = await this.requestBuilder.post<Contact>(
      API_ENDPOINTS.CONTACTS.CREATE,
      { data: contactData }
    );
    return response.data;
  }

  async updateContact(id: string, contactData: ContactUpdate): Promise<Contact> {
    this.logger.info('Updating contact', { id });
    return this.requestBuilder.put<Contact>(
      API_ENDPOINTS.CONTACTS.UPDATE(id),
      { data: contactData }
    );
  }

  async patchContact(id: string, contactData: ContactUpdate): Promise<Contact> {
    this.logger.info('Patching contact', { id });
    return this.requestBuilder.patch<Contact>(
      API_ENDPOINTS.CONTACTS.UPDATE(id),
      { data: contactData }
    );
  }

  async deleteContact(id: string): Promise<void> {
    this.logger.info('Deleting contact', { id });
    await this.requestBuilder.delete(API_ENDPOINTS.CONTACTS.DELETE(id));
  }

  async deleteAllContacts(): Promise<void> {
    this.logger.info('Deleting all contacts');
    const contacts = await this.getAllContacts();
    for (const contact of contacts) {
      if (contact._id) {
        await this.deleteContact(contact._id);
      }
    }
  }
}