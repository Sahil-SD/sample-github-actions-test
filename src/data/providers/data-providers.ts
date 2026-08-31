import { ContactCreate } from '../../api/models/contact.model';
import { UserRegistration } from '../../api/models/user.model';
import {
  generateContactTestData,
  generateUserRegistrationTestData,
  generateBoundaryContactData,
  TEST_DATA_SETS
} from '../combinatorial/test-data-sets';

export type TestDataType = 'valid' | 'invalid' | 'boundary' | 'pairwise';

export class DataProvider {
  private static instance: DataProvider;
  private cachedContactData: Map<TestDataType, ContactCreate[]> = new Map();
  private cachedUserData: Map<TestDataType, UserRegistration[]> = new Map();

  private constructor() {
    this.initializeCache();
  }

  public static getInstance(): DataProvider {
    if (!DataProvider.instance) {
      DataProvider.instance = new DataProvider();
    }
    return DataProvider.instance;
  }

  private initializeCache(): void {
    // Cache valid contacts
    this.cachedContactData.set('valid', TEST_DATA_SETS.VALID_CONTACTS);
    this.cachedContactData.set('invalid', TEST_DATA_SETS.INVALID_CONTACTS);
    this.cachedContactData.set('boundary', generateBoundaryContactData());
    this.cachedContactData.set('pairwise', generateContactTestData());

    // Cache valid users
    this.cachedUserData.set('valid', TEST_DATA_SETS.VALID_USERS);
    this.cachedUserData.set('pairwise', generateUserRegistrationTestData());
  }

  getContactData(type: TestDataType = 'valid'): ContactCreate[] {
    return this.cachedContactData.get(type) || [];
  }

  getSingleContact(type: TestDataType = 'valid'): ContactCreate {
    const data = this.getContactData(type);
    return data[Math.floor(Math.random() * data.length)] || TEST_DATA_SETS.VALID_CONTACTS[0];
  }

  getUserData(type: TestDataType = 'valid'): UserRegistration[] {
    return this.cachedUserData.get(type) || [];
  }

  getSingleUser(type: TestDataType = 'valid'): UserRegistration {
    const data = this.getUserData(type);
    return data[Math.floor(Math.random() * data.length)] || TEST_DATA_SETS.VALID_USERS[0];
  }

  /**
   * Generate unique contact with timestamp
   */
  generateUniqueContact(): ContactCreate {
    const timestamp = Date.now();
    return {
      firstName: `Test${timestamp}`,
      lastName: `Contact${timestamp}`,
      email: `test.contact.${timestamp}@example.com`,
      phone: '5551234567',
      birthdate: '1990-01-01',
      city: 'Test City',
      stateProvince: 'TS',
      postalCode: '12345',
      country: 'Test Country',
    };
  }

  /**
   * Generate unique user with timestamp
   */
  generateUniqueUser(): UserRegistration {
    const timestamp = Date.now();
    return {
      firstName: `Test${timestamp}`,
      lastName: `User${timestamp}`,
      email: `test.user.${timestamp}@example.com`,
      password: 'TestPassword123!',
    };
  }

  /**
   * Get data for parameterized tests
   */
  getParameterizedContactData(): Array<[string, ContactCreate]> {
    return this.getContactData('pairwise').map((contact, index) => [
      `Contact Test Case ${index + 1}: ${contact.firstName} ${contact.lastName}`,
      contact,
    ]);
  }

  getParameterizedUserData(): Array<[string, UserRegistration]> {
    return this.getUserData('pairwise').map((user, index) => [
      `User Test Case ${index + 1}: ${user.email}`,
      user,
    ]);
  }
}

export const dataProvider = DataProvider.getInstance();