/**
 * Contact List page locators
 */

export const ContactListLocators = {
  // Page identification
  PAGE: {
    CONTAINER: '#contact-list-page',
    TITLE: 'h1',
    URL_PATTERN: /\/contactList/,
  },

  // Header section
  HEADER: {
    LOGOUT_BUTTON: '#logout',
    PAGE_HEADING: 'h1',
  },

  // Action buttons
  BUTTONS: {
    ADD_CONTACT: '#add-contact',
  },

  // Contact table
  TABLE: {
    CONTAINER: '#myTable',
    HEADER_ROW: 'thead tr',
    BODY: 'tbody',
    ROWS: '.contactTableBodyRow',
    ROW_BY_INDEX: (index: number) => `.contactTableBodyRow:nth-child(${index})`,
    ROW_BY_NAME: (name: string) => `.contactTableBodyRow:has-text("${name}")`,
  },

  // Table columns (0-indexed)
  TABLE_COLUMNS: {
    CHECKBOX: 0,
    NAME: 1,
    BIRTHDATE: 2,
    EMAIL: 3,
    PHONE: 4,
    ADDRESS: 5,
    CITY_STATE_POSTAL: 6,
    COUNTRY: 7,
  },

  // Cell selectors within a row
  CELLS: {
    NAME: 'td:nth-child(2)',
    BIRTHDATE: 'td:nth-child(3)',
    EMAIL: 'td:nth-child(4)',
    PHONE: 'td:nth-child(5)',
    ADDRESS: 'td:nth-child(6)',
    CITY_STATE_POSTAL: 'td:nth-child(7)',
    COUNTRY: 'td:nth-child(8)',
  },

  // Empty state
  EMPTY_STATE: {
    MESSAGE: 'text=No contacts',
    CONTAINER: '.empty-state',
  },

  // Pagination (if exists)
  PAGINATION: {
    CONTAINER: '.pagination',
    PREVIOUS: '.pagination-prev',
    NEXT: '.pagination-next',
    PAGE_NUMBER: '.pagination-page',
  },
} as const;

export type ContactListLocatorKeys = typeof ContactListLocators;