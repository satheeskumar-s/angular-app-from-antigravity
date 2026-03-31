// Cypress E2E: Auth flows
describe('Authentication', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should redirect unauthenticated user from /home to /login', () => {
    cy.visit('/home');
    cy.url().should('include', '/login');
  });

  it('should display login form', () => {
    cy.visit('/login');
    cy.get('#username').should('exist');
    cy.get('#password').should('exist');
    cy.get('#login-submit').should('exist');
  });

  it('should show error on invalid credentials', () => {
    cy.visit('/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('wrongpassword');
    cy.get('#login-submit').click();
    cy.contains('Invalid username or password', { timeout: 2000 }).should('be.visible');
  });

  it('should login with valid credentials and redirect to /home', () => {
    cy.visit('/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('admin123');
    cy.get('#login-submit').click();
    cy.url({ timeout: 3000 }).should('include', '/home');
  });

  it('should logout and redirect to /login', () => {
    // login first
    cy.visit('/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('admin123');
    cy.get('#login-submit').click();
    cy.url({ timeout: 3000 }).should('include', '/home');
    // then logout via button
    cy.get('#logout-btn').click({ force: true });
    cy.url().should('include', '/login');
  });
});
