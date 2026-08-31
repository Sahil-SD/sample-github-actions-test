/**
 * Edit Contact page locators
 */

export const EditContactLocators = {
  // Page identification
  PAGE: {
    CONTAINER: '#edit-contact-page',
    TITLE: 'h1',
    URL_PATTERN: /\/editContact/,
  },

  // Form inputs - Personal Information
  INPUTS: {
    FIRST_NAME: '#firstName',
    LAST_NAME: '#lastName',
    BIRTHDATE: '#birthdate',
    EMAIL: '#email',
    PHONE: '#phone',
  },

  // Form inputs - Address Information
  ADDRESS_INPUTS: {
    STREET1: '#street1',
    STREET2: '#street2',
    CITY: '#city',
    STATE_PROVINCE: '#stateProvince',
    POSTAL_CODE: '#postalCode',
    COUNTRY: '#country',
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

  // Field validation errors
  VALIDATION: {
    FIRST_NAME_ERROR: '#firstName-error',
    LAST_NAME_ERROR: '#lastName-error',
    BIRTHDATE_ERROR: '#birthdate-error',
    EMAIL_ERROR: '#email-error',
    PHONE_ERROR: '#phone-error',
  },

  // Form sections
  SECTIONS: {
    PERSONAL_INFO: '.personal-info-section',
    ADDRESS_INFO: '.address-info-section',
  },
} as const;

export type EditContactLocatorKeys = typeof EditContactLocators;