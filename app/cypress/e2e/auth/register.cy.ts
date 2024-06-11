/// <reference types="cypress" />

describe('Register user test', () => {
  beforeEach(() => {
    cy.visit('/auth');
    cy.get('button:contains(Register)').click();
    cy.get('[data-testid="register-first-name"]').as('registerFirstNameInput');
    cy.get('[data-testid="register-last-name"]').as('registerLastNameInput');
    cy.get('[data-testid="register-user-name"]').as('registerUserNameInput');
    cy.get('[data-testid="register-email"]').as('registerEmailInput');
    cy.get('[data-testid="register-password"]').as('registerPasswordInput');
    cy.get('[data-testid="register-submit"]').as('registerButtonSubmit');
    cy.intercept(
      {
        method: 'POST',
        url: 'api/v1/register'
      },
      {
        statusCode: 200,
        fixture: 'users/user.json'
      }
    ).as('registerUsers');
  });

  it('should throw error if api call fails', () => {
    cy.intercept('POST', '/api/v1/register', { forceNetworkError: true }).as(
      'registerUsers'
    );

    cy.get('@registerFirstNameInput').type('John', { delay: 0 });
    cy.get('@registerLastNameInput').type('Doe', { delay: 0 });
    cy.get('@registerEmailInput').type('test@test.com', { delay: 0 });
    cy.get('@registerPasswordInput').type('StrongPassword12!', { delay: 0 });
    cy.get('@registerButtonSubmit').click();

    cy.get('[data-testid="error-log-message"]').should('exist');
  });

  it('should show error if no data is typed for first name, last name, email and password', () => {
    cy.get('@registerButtonSubmit').click();

    cy.get('div:contains(First name is required.)').should('exist');
    cy.get('div:contains(Last name is required.)').should('exist');
    cy.get('div:contains(Valid email is required.)').should('exist');
    cy.get('div:contains(Your password is not strong enough.)').should('exist');
  });

  it('should show error if wrong data is typed for email', () => {
    cy.get('@registerFirstNameInput').type('John', { delay: 0 });
    cy.get('@registerLastNameInput').type('Doe', { delay: 0 });
    cy.get('@registerEmailInput').type('test', { delay: 0 });
    cy.get('@registerPasswordInput').type('StrongPassword12!', { delay: 0 });
    cy.get('@registerButtonSubmit').click();

    cy.get('div:contains(Valid email is required.)').should('exist');
  });

  it('should show error if wrong data is typed for password', () => {
    cy.get('@registerFirstNameInput').type('John', { delay: 0 });
    cy.get('@registerLastNameInput').type('Doe', { delay: 0 });
    cy.get('@registerEmailInput').type('test@test.com', { delay: 0 });
    cy.get('@registerPasswordInput').type('weekPass', { delay: 0 });
    cy.get('@registerButtonSubmit').click();

    cy.get('div:contains(Your password is not strong enough.)').should('exist');
  });

  it('should register user and navigate to home page', () => {
    cy.get('@registerFirstNameInput').type('John', { delay: 0 });
    cy.get('@registerLastNameInput').type('Doe', { delay: 0 });
    cy.get('@registerEmailInput').type('test@test.com', { delay: 0 });
    cy.get('@registerPasswordInput').type('StrongPassword12!', { delay: 0 });
    cy.get('@registerButtonSubmit').click();

    cy.location('pathname').should('eq', '/home');
  });
});
