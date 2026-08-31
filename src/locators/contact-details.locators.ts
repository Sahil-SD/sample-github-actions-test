/**
 * Contact Details page locators
 */

export const ContactDetailsLocators = {
  // Page identification
  PAGE: {
    CONTAINER: '#contact-details-page',
    TITLE: 'h1',
    URL_PATTERN: /\/contactDetails/,
  },

  // Contact information display fields (spans/divs showing values)
  FIELDS: {
    FIRST_NAME: '#firstName',
    LAST_NAME: '#lastName',
    BIRTHDATE: '#birthdate',
    EMAIL: '#email',
    PHONE: '#phone',
    STREET1: '#street1',
    STREET2: '#street2',
    CITY: '#city',
    STATE_PROVINCE: '#stateProvince',
    POSTAL_CODE: '#postalCode',
    COUNTRY: '#country',
  },

  // Action buttons
  BUTTONS: {
    EDIT: '#edit-contact',
    DELETE: '#delete',
    RETURN: '#return',
  },

  // Sections
  SECTIONS: {
    PERSONAL_INFO: '.personal-info',
    ADDRESS_INFO: '.address-info',
    CONTACT_INFO: '.contact-info',
  },

  // Labels
  LABELS: {
    FIRST_NAME: 'label[for="firstName"]',
    LAST_NAME: 'label[for="lastName"]',
    BIRTHDATE: 'label[for="birthdate"]',
    EMAIL: 'label[for="email"]',
    PHONE: 'label[for="phone"]',
  },

  // Confirmation dialog
  DIALOG: {
    CONTAINER: '.confirmation-dialog',
    CONFIRM_BUTTON: '.dialog-confirm',
    CANCEL_BUTTON: '.dialog-cancel',
    MESSAGE: '.dialog-message',
  },
} as const;

export type ContactDetailsLocatorKeys = typeof ContactDetailsLocators;