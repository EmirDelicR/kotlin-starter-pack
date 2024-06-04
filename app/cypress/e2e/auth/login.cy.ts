/// <reference types="cypress" />

const LOGIN_BODY = {
  method: "POST",
  url: "api/v1/login",
};

describe("Login user test", () => {
  beforeEach(() => {
    cy.visit("/auth");
    cy.get('[data-testid="login-email"]').as("loginEmailInput");
    cy.get('[data-testid="login-password"]').as("loginPasswordInput");
    cy.get('[data-testid="login-submit"]').as("loginButtonSubmit");
    cy.intercept(LOGIN_BODY, {
      statusCode: 200,
      fixture: "users/user.json",
    }).as("loginUsers");
  });

  it("should throw error if api call fails", () => {
    cy.intercept("POST", "/api/v1/login", { forceNetworkError: true }).as(
      "loginUsers"
    );
    cy.get("@loginEmailInput").type("test@test.com", { delay: 0 });
    cy.get("@loginPasswordInput").type("test", { delay: 0 });
    cy.get("@loginButtonSubmit").click();

    cy.get('[data-testid="error-log-message"]').should("exist");
  });

  it("should show error if no data is typed for email and password", () => {
    cy.get("@loginButtonSubmit").click();

    cy.get("div:contains(Valid email is required.)").should("exist");
    cy.get("div:contains(Password field is required.)").should("exist");
  });

  it("should show error if wrong data is typed for email", () => {
    cy.get("@loginEmailInput").type("test", { delay: 0 });
    cy.get("@loginPasswordInput").type("test", { delay: 0 });
    cy.get("@loginButtonSubmit").click();

    cy.get("div:contains(Valid email is required.)").should("exist");
  });

  it("should login user and navigate to home page and have nav links Home, Work, Profile", () => {
    cy.get("@loginEmailInput").type("test@test.com", { delay: 0 });
    cy.get("@loginPasswordInput").type("test", { delay: 0 });
    cy.get("@loginButtonSubmit").click();

    cy.location("pathname").should("eq", "/home");
    cy.get("span:contains(Home)").should("exist");
    cy.get("span:contains(Work)").should("exist");
    cy.get("span:contains(Profile)").should("exist");
    cy.get("span:contains(Emails)").should("not.exist");
  });

  it("should login admin user and navigate to home page and have nav links Home, Work, Profile and Emails", () => {
    cy.intercept(LOGIN_BODY, {
      statusCode: 200,
      fixture: "users/admin.json",
    }).as("loginUsers");
    cy.get("@loginEmailInput").type("test@test.com", { delay: 0 });
    cy.get("@loginPasswordInput").type("test", { delay: 0 });
    cy.get("@loginButtonSubmit").click();

    cy.location("pathname").should("eq", "/home");
    cy.get("span:contains(Home)").should("exist");
    cy.get("span:contains(Work)").should("exist");
    cy.get("span:contains(Profile)").should("exist");
    cy.get("span:contains(Emails)").should("exist");
  });
});
