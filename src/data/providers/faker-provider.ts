import { faker } from '@faker-js/faker';
import { ContactCreate } from '../../api/models/contact.model';
import { UserRegistration } from '../../api/models/user.model';

export class FakerProvider {
  /**
   * Generate random contact data
   */
  static generateContact(overrides: Partial<ContactCreate> = {}): ContactCreate {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthdate: faker.date.birthdate({ min: 18, max: 80, mode: 'age' })
        .toISOString().split('T')[0],
      email: faker.internet.email(),
      phone: faker.phone.number('##########'),
      street1: faker.location.streetAddress(),
      street2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      stateProvince: faker.location.state({ abbreviated: true }),
      postalCode: faker.location.zipCode(),
      country: faker.location.country(),
      ...overrides,
    };
  }

  /**
   * Generate multiple random contacts
   */
  static generateContacts(count: number, overrides: Partial<ContactCreate> = {}): ContactCreate[] {
    return Array.from({ length: count }, () => this.generateContact(overrides));
  }

  /**
   * Generate random user registration data
   */
  static generateUser(overrides: Partial<UserRegistration> = {}): UserRegistration {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12, memorable: false, prefix: 'Aa1!' }),
      ...overrides,
    };
  }

  /**
   * Generate unique email for tests
   */
  static generateUniqueEmail(): string {
    return `test.${faker.string.uuid()}@automation.test`;
  }

  /**
   * Set seed for reproducible tests
   */
  static setSeed(seed: number): void {
    faker.seed(seed);
  }
}