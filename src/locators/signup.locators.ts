/**
 * Signup/Registration page locators
 */

export const SignupLocators = {
  // Page identification
  PAGE: {
    CONTAINER: '#add-user-page',
    TITLE: 'h1',
    URL_PATTERN: /\/addUser/,
  },

  // Form inputs
  INPUTS: {
    FIRST_NAME: '#firstName',
    LAST_NAME: '#lastName',
    EMAIL: '#email',
    PASSWORD: '#password',
  },

  // Buttons
  BUTTONS: {
    SUBMIT: '#submit',
    CANCEL: '#cancel',
  },

  // Messages
  MESSAGES: {
    ERROR: '#error',
    SUCCESS: '.success-message',
  },

  // Validation
  VALIDATION: {
    FIRST_NAME_ERROR: '#firstName-error',
    LAST_NAME_ERROR: '#lastName-error',
    EMAIL_ERROR: '#email-error',
    PASSWORD_ERROR: '#password-error',
  },
} as const;

export type SignupLocatorKeys = typeof SignupLocators;