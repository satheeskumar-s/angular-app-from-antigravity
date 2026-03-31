// Cypress E2E: User management
const login = () => {
  cy.clearLocalStorage();
  cy.visit('/login');
  cy.get('#username').type('admin');
  cy.get('#password').type('admin123');
  cy.get('#login-submit').click();
  cy.url({ timeout: 3000 }).should('include', '/home');
};

describe('Users', () => {
  beforeEach(login);

  it('should navigate to users list', () => {
    cy.visit('/users');
    cy.contains('Users').should('be.visible');
    cy.get('table').should('exist');
  });

  it('should show pagination', () => {
    cy.visit('/users');
    cy.get('mat-paginator').should('exist');
  });

  it('should filter users by search', () => {
    cy.visit('/users');
    cy.get('input[placeholder*="Name"]').type('Alice');
    cy.get('table tr.mat-mdc-row').should('have.length.lessThan', 9);
  });

  it('should navigate to create user form', () => {
    cy.visit('/users');
    cy.get('#add-user-btn').click();
    cy.url().should('include', '/users/new');
    cy.get('#firstName').should('exist');
    cy.get('#lastName').should('exist');
    cy.get('#email').should('exist');
  });

  it('should create a new user', () => {
    cy.visit('/users/new');
    cy.get('#firstName').type('Cypress');
    cy.get('#lastName').type('Test');
    cy.get('#email').type('cypress@test.com');
    cy.get('#submit-btn').click();
    cy.url({ timeout: 2000 }).should('include', '/users');
  });

  it('should view user detail', () => {
    cy.visit('/users/1');
    cy.contains('Alice').should('be.visible');
  });

  it('should navigate to edit user', () => {
    cy.visit('/users/1/edit');
    cy.get('#firstName').should('have.value', 'Alice');
  });
});
