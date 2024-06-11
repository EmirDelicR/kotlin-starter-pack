/// <reference types="cypress" />
import { Task, User } from '../../support/interfaces';

describe('Manage user tasks', () => {
  const title = 'dummy task 3';
  let user: User | null = null;
  let task: Task | null = null;

  before(() => {
    cy.fixture('users/user.json').then((data) => {
      user = data.data;
    });

    cy.fixture('tasks/task.json').then((data) => {
      task = data;
    });
  });

  beforeEach(() => {
    cy.login();
    cy.intercept(
      {
        method: 'GET',
        url: `api/v1/tasks/paginated/${
          user!.id
        }?page=0&pageSize=5&isMobile=false`
      },
      {
        statusCode: 200,
        fixture: 'tasks/tasks.json'
      }
    ).as('getPaginatedTasks');

    cy.intercept(
      {
        method: 'POST',
        url: 'api/v1/tasks'
      },
      {
        statusCode: 200,
        fixture: 'tasks/task.json'
      }
    ).as('createTask');

    cy.intercept(
      {
        method: 'PUT',
        url: 'api/v1/tasks/*'
      },
      {
        statusCode: 200
      }
    ).as('updateTask');

    cy.intercept(
      {
        method: 'DELETE',
        url: 'api/v1/tasks/*'
      },
      {
        statusCode: 200
      }
    ).as('deleteTask');
  });

  it('should throw error if api call fails', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'api/v1/tasks/paginated/userId?page=0&pageSize=5&isMobile=false'
      },
      { forceNetworkError: true }
    ).as('getPaginatedTasks');

    cy.navigateTo('Work');
    cy.get('[data-testid="error-log-message"]').should('exist');
  });

  it('should create a task', () => {
    cy.navigateTo('Work');
    cy.get('button:contains(Create)').click();
    cy.get('[data-testid="task-title"]').type(title, { delay: 0 });

    cy.interceptWithFixtureHook<{
      data: { totalCount: number; tasks: Task[] };
    }>(
      {
        method: 'GET',
        url: `api/v1/tasks/paginated/${
          user!.id
        }?page=0&pageSize=5&isMobile=false`
      },
      'tasks/tasks.json',
      (items) => {
        items.data.totalCount = items.data.tasks.length + 1;
        items.data.tasks.push(task!);
      }
    );

    cy.get('button:contains(Submit)').click();

    cy.get('@createTask').its('request.body').should('deep.equal', {
      userId: user!.id,
      title: title
    });

    cy.get(`p:contains(${title})`).should('exist');
  });

  it('should fail to create a task', () => {
    cy.intercept('POST', 'api/v1/tasks', { forceNetworkError: true }).as(
      'failCreateTask'
    );
    cy.navigateTo('Work');
    cy.get('button:contains(Create)').click();
    cy.get('[data-testid="task-title"]').type(title, { delay: 0 });
    cy.get('button:contains(Submit)').click();

    cy.get('[data-testid="error-log-message"]').should('exist');
  });

  it('should update task', () => {
    cy.navigateTo('Work');
    cy.wait('@getPaginatedTasks').then(() => {
      cy.interceptWithFixtureHook<{
        data: { totalCount: number; tasks: Task[] };
      }>(
        {
          method: 'GET',
          url: `/api/v1/tasks/paginated/${
            user!.id
          }?page=0&pageSize=5&isMobile=false`
        },
        'tasks/tasks.json',
        (items) => {
          items.data.tasks[0].completed = true;
        }
      );
    });

    cy.get('[data-testid="task-update-icon"]').first().click();

    cy.get('@updateTask').its('request.body').should('deep.equal', {
      completed: true,
      createdAt: '2024-02-17T09:19:32.712Z',
      id: 'dummy-task-id-1',
      title: 'dummy task 1',
      userId: user!.id
    });
  });

  it('should fail to update task', () => {
    cy.intercept('PUT', 'api/v1/tasks/*', { forceNetworkError: true }).as(
      'failUpdateTask'
    );

    cy.navigateTo('Work');
    cy.get('[data-testid="task-update-icon"]').first().click();

    cy.get('div:contains(Error updating task)').should('exist');
  });

  it('should fail to delete task', () => {
    cy.intercept('DELETE', 'api/v1/tasks/*', { forceNetworkError: true }).as(
      'failDeleteTask'
    );
    cy.navigateTo('Work');
    cy.get('[data-testid="task-delete-icon"]').first().click();

    cy.get('div:contains(Error deleting task)').should('exist');
  });

  it('should delete task', () => {
    cy.navigateTo('Work');

    cy.wait('@getPaginatedTasks').then(() => {
      cy.interceptWithFixtureHook<{
        data: { totalCount: number; tasks: Task[] };
      }>(
        {
          method: 'GET',
          url: `/api/v1/tasks/paginated/${
            user!.id
          }?page=0&pageSize=5&isMobile=false`
        },
        'tasks/tasks.json',
        (items) => {
          items.data.tasks = [items.data.tasks[1]];
        }
      );
    });

    cy.get('[data-testid="task-delete-icon"]').first().click();

    cy.get('@deleteTask').its('request.body').should('deep.equal', {
      userId: user!.id
    });

    cy.get(`p:contains(dummy task 1)`).should('not.exist');
  });

  it('should set to initial state', () => {
    cy.navigateTo('Work');

    cy.fixture('tasks/tasks.json').then((data) => {
      expect(data.data.tasks.length).to.eq(2);
    });
  });
});
