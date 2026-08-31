/**
 * Test Users Configuration
 * These users should be pre-created in the system for automation purposes
 * DO NOT commit actual credentials to version control in production
 */

export interface TestUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'default' | 'admin' | 'readonly' | 'premium';
  storageStatePath: string;
}

export const TEST_USERS: Record<string, TestUser> = {
  DEFAULT_USER: {
    id: 'default-user',
    email: 'automation.default@test.com',
    password: 'AutoTest@123',
    firstName: 'Automation',
    lastName: 'Default',
    role: 'default',
    storageStatePath: 'storage/auth/default-user.json',
  },
  ADMIN_USER: {
    id: 'admin-user',
    email: 'automation.admin@test.com',
    password: 'AutoAdmin@123',
    firstName: 'Automation',
    lastName: 'Admin',
    role: 'admin',
    storageStatePath: 'storage/auth/admin-user.json',
  },
  SECONDARY_USER: {
    id: 'secondary-user',
    email: 'automation.secondary@test.com',
    password: 'AutoSecond@123',
    firstName: 'Automation',
    lastName: 'Secondary',
    role: 'default',
    storageStatePath: 'storage/auth/secondary-user.json',
  },
};

export const getTestUser = (role: TestUser['role'] = 'default'): TestUser => {
  const user = Object.values(TEST_USERS).find((u) => u.role === role);
  if (!user) {
    throw new Error(`No test user found with role: ${role}`);
  }
  return user;
};

export const getAllTestUsers = (): TestUser[] => Object.values(TEST_USERS);