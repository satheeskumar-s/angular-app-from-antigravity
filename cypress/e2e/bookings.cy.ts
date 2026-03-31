// Cypress E2E: Booking management
const login = () => {
  cy.clearLocalStorage();
  cy.visit('/login');
  cy.get('#username').type('admin');
  cy.get('#password').type('admin123');
  cy.get('#login-submit').click();
  cy.url({ timeout: 3000 }).should('include', '/home');
};

describe('Bookings', () => {
  beforeEach(login);

  it('should navigate to bookings list', () => {
    cy.visit('/bookings');
    cy.contains('Bookings').should('be.visible');
    cy.get('table').should('exist');
  });

  it('should show pagination', () => {
    cy.visit('/bookings');
    cy.get('mat-paginator').should('exist');
  });

  it('should filter bookings by search', () => {
    cy.visit('/bookings');
    cy.get('input[placeholder*="Title"]').type('Meeting');
    cy.get('table tr.mat-mdc-row').should('have.length.lessThan', 7);
  });

  it('should navigate to add booking form', () => {
    cy.visit('/bookings');
    cy.get('#add-booking-btn').click();
    cy.url().should('include', '/bookings/new');
    cy.get('#booking-title').should('exist');
  });

  it('should create a new booking', () => {
    cy.visit('/bookings/new');
    cy.get('#booking-title').type('E2E Test Booking');
    cy.get('#resourceName').type('Test Room');
    cy.get('#submit-booking-btn').click();
    cy.url({ timeout: 2000 }).should('include', '/bookings');
  });

  it('should view booking detail', () => {
    cy.visit('/bookings/1');
    cy.contains('Team Strategy Meeting').should('be.visible');
  });

  it('should navigate to edit booking', () => {
    cy.visit('/bookings/1/edit');
    cy.get('#booking-title').should('have.value', 'Team Strategy Meeting');
  });
});
