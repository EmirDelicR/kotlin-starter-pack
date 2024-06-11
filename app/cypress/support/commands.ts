/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
type Routes = 'Home' | 'Work' | 'Profile' | 'Emails';

Cypress.Commands.add('login', (asAdmin: boolean = false) => {
  window.localStorage.setItem('token', JSON.stringify('dummy-token'));
  let fixture = 'users/user.json';
  let user = null;
  if (asAdmin) {
    fixture = 'users/admin.json';
  }

  cy.fixture(fixture).then((data) => {
    user = data.data;
  });

  cy.visit('/home', {
    onBeforeLoad: () => {
      cy.window()
        .its('Cypress')
        .its('store')
        .invoke('dispatch', {
          type: 'user/setUser',
          payload: { data: user, status: 200 }
        });
    }
  });

  cy.intercept(
    {
      method: 'POST',
      url: 'api/v1/autoLogin'
    },
    {
      statusCode: 200,
      fixture: fixture
    }
  ).as('autoLoginUser');
  cy.intercept({ method: 'GET', url: 'api/v1/refresh' }).as('refreshToken');
  cy.wait('@autoLoginUser').then(() => {
    cy.window()
      .its('Cypress')
      .its('store')
      .invoke('getState')
      .its('user')
      .should('deep.equal', { data: user });
  });
});

Cypress.Commands.add('navigateTo', (route: Routes) => {
  cy.get(`span:contains(${route})`).click();
});

type FixtureHook<T> = (data: T) => T | void;

Cypress.Commands.add(
  'interceptWithFixtureHook',
  <T>(
    url: { method: string; url: string },
    fixturePath: string,
    fixtureHook: FixtureHook<T>
  ) => {
    cy.fixture<T>(fixturePath).then((fixtureData) => {
      const getData = (): T => {
        const data = structuredClone(fixtureData);
        const modifiedData = fixtureHook(data) as T; // may mutate `data`
        return modifiedData ?? data;
      };
      cy.intercept(url, (req) => {
        req.reply({ body: getData() });
      }).as('interceptRequest');
    });
  }
);
