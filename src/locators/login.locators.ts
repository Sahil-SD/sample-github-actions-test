/**
 * Login page locators
 */

export const LoginLocators = {
  // Page identification
  PAGE: {
    CONTAINER: '#login-page',
    TITLE: 'h1',
    URL_PATTERN: /\/(login)?$/,
  },

  // Form inputs
  INPUTS: {
    EMAIL: '#email',
    PASSWORD: '#password',
  },

  // Buttons
  BUTTONS: {
    SUBMIT: '#submit',
    SIGNUP: '#signup',
  },

  // Messages
  MESSAGES: {
    ERROR: '#error',
    WELCOME: '.welcome-message',
  },

  // Links
  LINKS: {
    FORGOT_PASSWORD: 'a[href*="forgot"]',
    SIGNUP: '#signup',
  },
} as const;

export type LoginLocatorKeys = typeof LoginLocators;