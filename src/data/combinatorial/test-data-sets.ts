/**
 * Pre-defined test data sets using combinatorial techniques
 */

import { CombinatorialGenerator, Parameter } from './combinatorial-generator';
import { PairwiseGenerator } from './pairwise-generator';
import { ContactCreate } from '../../api/models/contact.model';
import { UserRegistration } from '../../api/models/user.model';

// Contact field parameters for combinatorial testing
export const CONTACT_PARAMETERS: Parameter[] = [
  {
    name: 'firstName',
    values: ['John', 'A', 'A'.repeat(50), ''], // Normal, min, max, empty
  },
  {
    name: 'lastName',
    values: ['Doe', 'B', 'B'.repeat(50), ''],
  },
  {
    name: 'email',
    values: ['valid@email.com', 'invalid-email', '', 'test@test'],
  },
  {
    name: 'phone',
    values: ['1234567890', '123', '12345678901234567890', ''],
  },
  {
    name: 'birthdate',
    values: ['1990-01-01', '2000-12-31', '', '1800-01-01'],
  },
];

// User registration parameters
export const USER_REGISTRATION_PARAMETERS: Parameter[] = [
  {
    name: 'firstName',
    values: ['ValidName', 'A', '', 'A'.repeat(100)],
  },
  {
    name: 'lastName',
    values: ['ValidLast', 'B', '', 'B'.repeat(100)],
  },
  {
    name: 'email',
    values: ['valid@test.com', 'invalid', '', 'test@'],
  },
  {
    name: 'password',
    values: ['ValidPass123', 'short', '', 'a'.repeat(100)],
  },
];

// Login parameters
export const LOGIN_PARAMETERS: Parameter[] = [
  {
    name: 'email',
    values: ['valid@test.com', 'nonexistent@test.com', '', 'invalid-email'],
  },
  {
    name: 'password',
    values: ['correctPassword', 'wrongPassword', '', 'a'],
  },
];

/**
 * Generate pairwise test data for contacts
 */
export function generateContactTestData(): ContactCreate[] {
  const generator = new PairwiseGenerator(CONTACT_PARAMETERS);
  const testCases = generator.generate();

  return testCases.map(tc => ({
    firstName: tc.firstName as string,
    lastName: tc.lastName as string,
    email: tc.email as string,
    phone: tc.phone as string,
    birthdate: tc.birthdate as string,
  }));
}

/**
 * Generate pairwise test data for user registration
 */
export function generateUserRegistrationTestData(): UserRegistration[] {
  const generator = new PairwiseGenerator(USER_REGISTRATION_PARAMETERS);
  const testCases = generator.generate();

  return testCases.map(tc => ({
    firstName: tc.firstName as string,
    lastName: tc.lastName as string,
    email: tc.email as string,
    password: tc.password as string,
  }));
}

/**
 * Generate boundary test data for contact fields
 */
export function generateBoundaryContactData(): ContactCreate[] {
  const firstNameLengths = CombinatorialGenerator.boundaryValues(1, 50, true);
  const lastNameLengths = CombinatorialGenerator.boundaryValues(1, 50, true);

  const testData: ContactCreate[] = [];

  for (const fnLen of firstNameLengths) {
    for (const lnLen of lastNameLengths) {
      testData.push({
        firstName: 'A'.repeat(Math.max(0, fnLen)),
        lastName: 'B'.repeat(Math.max(0, lnLen)),
      });
    }
  }

  return testData;
}

/**
 * Pre-generated test data sets for common scenarios
 */
export const TEST_DATA_SETS = {
  VALID_CONTACTS: [
    {
      firstName: 'John',
      lastName: 'Doe',
      birthdate: '1990-05-15',
      email: 'john.doe@example.com',
      phone: '5551234567',
      street1: '123 Main St',
      street2: 'Apt 4B',
      city: 'New York',
      stateProvince: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      birthdate: '1985-12-20',
      email: 'jane.smith@example.com',
      phone: '5559876543',
      street1: '456 Oak Ave',
      city: 'Los Angeles',
      stateProvince: 'CA',
      postalCode: '90001',
      country: 'USA',
    },
  ] as ContactCreate[],

  INVALID_CONTACTS: [
    { firstName: '', lastName: 'Test' }, // Empty first name
    { firstName: 'Test', lastName: '' }, // Empty last name
  ] as ContactCreate[],

  VALID_USERS: [
    {
      firstName: 'Test',
      lastName: 'User',
      email: `test.user.${Date.now()}@example.com`,
      password: 'TestPassword123!',
    },
  ] as UserRegistration[],
};

// Export for use in tests
export { CombinatorialGenerator, PairwiseGenerator };