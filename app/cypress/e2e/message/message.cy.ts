/// <reference types="cypress" />
import { Message } from '../../support/interfaces';

describe('Message table test', () => {
  let messagesData: { numberOfPages: number; items: Message[] } | null = null;
  let message: Message | null = null;

  before(() => {
    cy.fixture('messages/messages.json').then((data) => {
      messagesData = data.data;
    });

    cy.fixture('messages/message.json').then((data) => {
      message = data.data;
    });
  });

  beforeEach(() => {
    cy.login(true);

    cy.intercept(
      {
        method: 'GET',
        url: 'api/v1/messages/paginated?page=1&pageSize=5&columnId=createdAt&desc=ASC&filter='
      },
      {
        statusCode: 200,
        fixture: 'messages/messages.json'
      }
    ).as('getPaginatedMessages');

    cy.intercept(
      {
        method: 'GET',
        url: `api/v1/messages/${messagesData?.items[0].id}`
      },
      {
        statusCode: 200,
        fixture: 'messages/message.json'
      }
    ).as('getMessage');

    cy.intercept(
      {
        method: 'PUT',
        url: `api/v1/messages/${message?.id}`
      },
      {
        statusCode: 200,
        fixture: 'messages/message.json'
      }
    ).as('updateMessage');

    cy.intercept(
      {
        method: 'DELETE',
        url: `api/v1/messages/${message?.id}`
      },
      {
        statusCode: 200,
        fixture: 'messages/message.json'
      }
    ).as('deleteMessage');

    cy.intercept('GET', '/api/v1/tasks/userId/statistics', {
      statusCode: 200,
      fixture: 'tasks/statistics.json'
    }).as('taskStatistics');
  });

  it('should navigate to emails page and show messages', () => {
    cy.navigateTo('Emails');

    cy.wait('@getPaginatedMessages');
    cy.get('[data-testid="table"]').should('exist');
    cy.get('[data-testid="table"] tbody tr').should(
      'have.length',
      messagesData?.items.length
    );
  });

  it('should navigate to emails page and show message details', () => {
    cy.navigateTo('Emails');

    cy.wait('@getPaginatedMessages');
    cy.get('[data-testid="table"]').as('table');
    cy.get('@table').should('exist');
    cy.get('@table')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(5)
      .find('[data-testid="message-show-icon"]')
      .click();

    cy.wait('@getMessage');

    cy.get('h2:contains(Message details)').should('exist');
    cy.get('div:contains(Send on date:)').should('exist');
    cy.get('div:contains(Sender:)').should('exist');
    cy.get(`span:contains(${message?.sender})`).should('exist');
    cy.get('div:contains(Email:)').should('exist');
    cy.get(`span:contains(${message?.email})`).should('exist');
    cy.get('div:contains(Mark as readed)').should('exist');
    cy.get(`[id^=${message?.id}]`).should('not.be.checked');
    cy.get('span:contains(Message)').should('exist');
    cy.get(`div:contains(${message?.message})`).should('exist');
  });

  it('should navigate to emails page and show message details and marked as reded', () => {
    cy.navigateTo('Emails');

    cy.wait('@getPaginatedMessages');
    cy.get('[data-testid="table"]').as('table');
    cy.get('@table').should('exist');

    cy.get('@table')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(5)
      .find('[data-testid="message-show-icon"]')
      .click();

    cy.wait('@getMessage');

    cy.get('h2:contains(Message details)').should('exist');
    cy.get(`[id^=${message?.id}]`).as('checkbox');
    cy.interceptWithFixtureHook<{
      data: Message;
    }>(
      {
        method: 'GET',
        url: `/api/v1/messages/${message!.id}`
      },
      'messages/message.json',
      (message) => {
        message.data.unread = false;
      }
    );
    cy.get('@checkbox').click();
    cy.get('@updateMessage').its('request.body').should('deep.equal', '');
    cy.get('@checkbox').should('be.checked');
  });

  it('should show message details and on update show error if request fails', () => {
    cy.navigateTo('Emails');

    cy.wait('@getPaginatedMessages');
    cy.get('[data-testid="table"]').as('table');
    cy.get('@table').should('exist');

    cy.get('@table')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(5)
      .find('[data-testid="message-show-icon"]')
      .click();

    cy.wait('@getMessage');

    cy.get('h2:contains(Message details)').should('exist');
    cy.get(`[id^=${message?.id}]`).as('checkbox');
    cy.intercept('PUT', `/api/v1/messages/${message!.id}`, {
      forceNetworkError: true
    }).as('failUpdateTask');
    cy.get('@checkbox').click();
    cy.get('@checkbox').should('not.be.checked');
    cy.get('[data-testid="error-log-message"]').should('exist');
  });

  it('should delete message', () => {
    cy.navigateTo('Emails');

    cy.wait('@getPaginatedMessages').then(() => {
      cy.interceptWithFixtureHook<{
        data: { totalCount: number; items: Message[] };
      }>(
        {
          method: 'GET',
          url: 'api/v1/messages/paginated?page=1&pageSize=5&columnId=createdAt&desc=ASC&filter='
        },
        'messages/messages.json',
        (items) => {
          const [_firstItem, ...rest] = items.data.items;
          items.data.items = rest;
        }
      );
    });
    cy.get('[data-testid="table"]').as('table');
    cy.get('@table').should('exist');

    cy.get('@table')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(5)
      .find('[data-testid="message-delete-icon"]')
      .click();

    cy.wait('@interceptRequest');
    cy.get('[data-testid="table"] tbody tr').should('have.length', 5);
  });

  it('should filer messages', () => {
    cy.navigateTo('Emails');
    const searchText = 'Search';

    cy.intercept(
      {
        method: 'GET',
        url: `api/v1/messages/paginated?page=1&pageSize=5&columnId=createdAt&desc=ASC&filter=${searchText}`
      },
      {
        statusCode: 200,
        fixture: 'messages/messages.json'
      }
    ).as('getPaginatedMessagesWithSearch');

    cy.get('[data-testid="search-input"]').type(searchText, { delay: 0 });

    cy.get('@getPaginatedMessagesWithSearch').then(() => {
      cy.get('[data-testid="table"] tbody tr').should('have.length', 1);
    });
  });

  it('should change number of items on page', () => {
    cy.navigateTo('Emails');

    cy.wait('@getPaginatedMessages').then(() => {
      cy.interceptWithFixtureHook<{
        data: { totalCount: number; items: Message[] };
      }>(
        {
          method: 'GET',
          url: 'api/v1/messages/paginated?page=1&pageSize=10&columnId=createdAt&desc=ASC&filter='
        },
        'messages/messages.json',
        (items) => {
          items.data.items = [...items.data.items, ...items.data.items];
        }
      );
    });

    cy.get('[data-testid="show-entry-select"]').should('exist').click();
    cy.get('span:contains(Show 10)')
      .click()
      .then(() => {
        cy.wait('@interceptRequest').then(() => {
          cy.get('[data-testid="table"] tbody tr').should('have.length', 12);
        });
      });
  });
});
