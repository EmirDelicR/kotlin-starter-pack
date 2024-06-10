/// <reference types="cypress" />

describe("Contact form test", () => {
  const message = "Message that user sends.";
  const email = "test@test.com";
  const name = "John Doe";

  beforeEach(() => {
    cy.login();
    cy.navigateTo("Profile");
    cy.intercept(
      {
        method: "POST",
        url: "api/v1/messages",
      },
      {
        statusCode: 200,
        fixture: "messages/message.json",
      }
    ).as("postMessage");
  });

  it("should throw error if api call fails", () => {
    cy.intercept(
      {
        method: "POST",
        url: "/api/v1/messages",
      },
      { forceNetworkError: true }
    ).as("postMessage");

    cy.get("h3:contains(Contact Us)").should("exist");
    cy.scrollTo("bottom");

    cy.get('[data-testid="contact-email"]').type(email, { delay: 0 });
    cy.get('[data-testid="contact-full-name"]').type(name, { delay: 0 });
    cy.get('[data-testid="contact-message"]').type(message, { delay: 0 });
    cy.get("button:contains(Send message)").click();

    cy.get('[data-testid="error-log-message"]').should("exist");
  });

  it("should show validation messages", () => {
    cy.get("h3:contains(Contact Us)").should("exist");
    cy.scrollTo("bottom");
    cy.get("button:contains(Send message)").click();

    cy.get("p:contains(Valid email is required.)").should("exist");
    cy.get("p:contains(Full name is required.)").should("exist");
    cy.get("p:contains(Message is required.)").should("exist");
  });

  it("should successfully send message", () => {
    cy.get("h3:contains(Contact Us)").should("exist");
    cy.scrollTo("bottom");

    cy.get('[data-testid="contact-email"]').type(email, { delay: 0 });
    cy.get('[data-testid="contact-full-name"]').type(name, { delay: 0 });
    cy.get('[data-testid="contact-message"]').type(message, { delay: 0 });
    cy.get("button:contains(Send message)").click();

    cy.get("div:contains(Message was send successfully)").should("exist");
  });
});
