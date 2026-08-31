/**
 * Common locators used across multiple pages
 */

export const CommonLocators = {
  // Header elements
  HEADER: {
    LOGOUT_BUTTON: '#logout',
    PAGE_TITLE: 'h1',
    LOGO: '.logo',
  },

  // Form elements
  FORM: {
    SUBMIT_BUTTON: '#submit',
    CANCEL_BUTTON: '#cancel',
    ERROR_MESSAGE: '#error',
  },

  // Common input fields
  INPUT: {
    EMAIL: '#email',
    PASSWORD: '#password',
    FIRST_NAME: '#firstName',
    LAST_NAME: '#lastName',
  },

  // Loading states
  LOADING: {
    SPINNER: '.loading-spinner',
    OVERLAY: '.loading-overlay',
  },

  // Alerts and notifications
  ALERTS: {
    SUCCESS: '.alert-success',
    ERROR: '.alert-error',
    WARNING: '.alert-warning',
    INFO: '.alert-info',
  },

  // Table elements
  TABLE: {
    CONTAINER: 'table',
    HEADER: 'thead',
    BODY: 'tbody',
    ROW: 'tr',
    CELL: 'td',
    HEADER_CELL: 'th',
  },

  // Buttons
  BUTTONS: {
    PRIMARY: '.btn-primary',
    SECONDARY: '.btn-secondary',
    DANGER: '.btn-danger',
  },
} as const;

// Type for accessing nested locator values
export type CommonLocatorKeys = typeof CommonLocators;