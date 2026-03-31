// Cypress E2E: Settings page
const login = () => {
  cy.clearLocalStorage();
  cy.visit('/login');
  cy.get('#username').type('admin');
  cy.get('#password').type('admin123');
  cy.get('#login-submit').click();
  cy.url({ timeout: 3000 }).should('include', '/home');
};

describe('Settings', () => {
  beforeEach(login);

  it('should navigate to settings page', () => {
    cy.visit('/settings');
    cy.contains('Settings').should('be.visible');
  });

  it('should display profile form with user data', () => {
    cy.visit('/settings');
    cy.get('#settings-firstName').should('have.value', 'Admin');
    cy.get('#settings-email').should('have.value', 'admin@example.com');
  });

  it('should save profile successfully', () => {
    cy.visit('/settings');
    cy.get('#save-profile-btn').click();
    cy.contains('Profile saved').should('be.visible');
  });

  it('should toggle email notifications', () => {
    cy.visit('/settings');
    cy.get('#email-notifications-toggle').click({ force: true });
  });

  it('should save preferences', () => {
    cy.visit('/settings');
    cy.get('#save-prefs-btn').click();
    cy.contains('Preferences saved').should('be.visible');
  });

  it('should logout from settings page', () => {
    cy.visit('/settings');
    cy.get('#logout-btn').click();
    cy.url().should('include', '/login');
  });
});
