import { test } from '@playwright/test';
import { BusinessKeywords } from '../../src/keywords/businessKeywords';
import { FileHandler } from '../../src/utils/fileHandler';
import { logger } from '../../src/utils/logger';
import path from 'node:path';

interface TestUser {
    username: string;
    password: string;
    expectedRole: string;
}

interface TestData {
    users: TestUser[];
}

const dataPath = path.join(__dirname, '../../src/data/testData.json');

test.describe('Checkout Tests - Data Driven', () => {
    let businessKeywords: BusinessKeywords;
    const testUsers: TestUser[] = FileHandler.readJSON<TestData>(dataPath).users;

    test.beforeEach(async ({ page }) => {
        businessKeywords = new BusinessKeywords(page);
    });

    for (const user of testUsers) {
        test.describe(`Tests for ${user.username}`, () => {
            test('User can add products and proceed to checkout', async () => {
                logger.info(`Running test with user: ${user.username}`);

                // Arrange & Act
                await businessKeywords.LOGIN_AS_USER(user.username, user.password);
                await businessKeywords.VERIFY_DASHBOARD_LOADED();

                // Add 2 products
                await businessKeywords.ADD_PRODUCT_TO_CART(2);
                await businessKeywords.VERIFY_CART_COUNT('2');

                // Assert
                logger.info('✓ Test passed');
            });
        });
    }
});