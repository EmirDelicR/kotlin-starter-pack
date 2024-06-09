/// <reference types="cypress" />
import { User } from "../../support/interfaces";

const UPDATED_DATA = {
  name: "JohnUpdated",
  lastName: "DoeUpdated",
  age: "25",
  subscriptions: [
    {
      id: "5d807ed5-a46b-4907-a99a-0fb6273d3903",
      name: "news",
    },
    {
      id: "5d807ed6-a46b-4907-a99a-0fb6273d3903",
      name: "code",
    },
  ],
  subscribed: true,
};

describe("Profile form test", () => {
  let user: User | null = null;

  before(() => {
    cy.fixture("users/user.json").then((data) => {
      user = data.data;
    });
  });

  beforeEach(() => {
    cy.login();
    cy.intercept(
      {
        method: "PUT",
        url: `/api/v1/users/${user!.id}`,
      },
      {
        statusCode: 200,
        fixture: "users/user.json",
      }
    ).as("updateUser");

    cy.intercept(
      {
        method: "GET",
        url: "api/v1/subscriptions",
      },
      {
        statusCode: 200,
        fixture: "subscriptions.json",
      }
    ).as("getSubscriptions");
  });

  const checkFirstStep = () => {
    // First step layout
    cy.get("label:contains(First Name)").should("exist");
    cy.get("label:contains(Last Name)").should("exist");
    cy.get("label:contains(Age)").should("exist");
    cy.get("button:contains(Back)").should("to.be.disabled");
    cy.get("button:contains(Next)").should("exist");

    // First step validation
    cy.get('[data-testid="profile-first-name"]').clear();
    cy.get('[data-testid="profile-last-name"]').clear();
    cy.get('[data-testid="profile-age"]').clear();

    cy.get("button:contains(Next)").click();

    cy.get("p:contains(First name is required)").should("exist");
    cy.get('[data-testid="profile-first-name"]').type(UPDATED_DATA.name);
    cy.get("button:contains(Next)").click();
    cy.get("p:contains(First name is required)").should("not.exist");

    cy.get("p:contains(Last name is required)").should("exist");
    cy.get('[data-testid="profile-last-name"]').type(UPDATED_DATA.lastName);
    cy.get("button:contains(Next)").click();
    cy.get("p:contains(Last name is required)").should("not.exist");

    cy.get("p:contains(Age must be provided)").should("exist");
    cy.get('[data-testid="profile-age"]').type(UPDATED_DATA.age);
    cy.get("button:contains(Next)").click();
  };

  const checkSecondStep = () => {
    cy.get("button:contains(Next)").click();
    cy.get("div:contains(Avatar must be set |)").should("exist");
    cy.get('img[alt="Avatar-5"]').click();
    cy.get("button:contains(Next)").click();
  };

  const checkThirdStep = () => {
    cy.get("p:contains(Stop taking advice from the dark side.)").should(
      "exist"
    );
    cy.get("p:contains(news)").should("exist");
    cy.get("p:contains(code)").should("exist");
    cy.get("p:contains(general)").should("exist");
    cy.get('[data-testid="subscription-chip"]').should("exist");
    cy.get('[data-testid="subscription-switch-news"]')
      .should("exist")
      .should("be.disabled");
    cy.get('[data-testid="subscription-switch-code"]')
      .should("exist")
      .should("be.disabled");
    cy.get('[data-testid="subscription-switch-general"]')
      .should("exist")
      .should("be.disabled");
    cy.get('[data-testid="subscription-chip"]').click({ force: true });
    cy.get('[data-testid="subscription-switch-news"]')
      .should("not.be.disabled")
      .click({ force: true });
    cy.get('[data-testid="subscription-switch-code"]')
      .should("not.be.disabled")
      .click({ force: true });
    cy.get('[data-testid="subscription-switch-general"]').should(
      "not.be.disabled"
    );
    cy.get("button:contains(Submit)").click();
  };

  it("should open modal and update user on profile page", () => {
    cy.navigateTo("Profile");
    cy.get("button:contains(Edit Profile)").click();
    cy.get("h2:contains(Edit Profile)").should("exist");

    checkFirstStep();
    checkSecondStep();
    checkThirdStep();

    cy.interceptWithFixtureHook<{ data: User }>(
      { method: "PUT", url: `/api/v1/users/${user!.id}` },
      "users/user.json",
      (item) => {
        (item.data.age = Number(UPDATED_DATA.age)),
          (item.data.firstName = UPDATED_DATA.name),
          (item.data.lastName = UPDATED_DATA.lastName),
          (item.data.subscribed = UPDATED_DATA.subscribed);
        item.data.subscriptions = UPDATED_DATA.subscriptions;
      }
    );

    cy.get("h4:contains(Updating profile)").should("exist");
    cy.get("button:contains(Submit)").click();

    cy.wait("@interceptRequest").then(() => {
      cy.get("h2:contains(Edit Profile)").should("not.exist");
      cy.get(
        `p:contains(${UPDATED_DATA.name} ${UPDATED_DATA.lastName})`
      ).should("exist");
      cy.get("span:contains(Subscription alerts activated)").should("exist");
      cy.get(`span:contains(${UPDATED_DATA.age})`).should("exist");
    });
  });

  it("should open modal and fail to update user if request fails on profile page", () => {
    cy.navigateTo("Profile");
    cy.get("button:contains(Edit Profile)").click();
    cy.get("h2:contains(Edit Profile)").should("exist");

    checkFirstStep();
    checkSecondStep();
    checkThirdStep();

    cy.intercept(
      {
        method: "PUT",
        url: `/api/v1/users/${user!.id}`,
      },
      { forceNetworkError: true }
    ).as("updateUser");

    // Last step
    cy.get("h4:contains(Updating profile)").should("exist");
    cy.get("button:contains(Submit)").click();

    cy.wait("@updateUser").then(() => {
      cy.get("h2:contains(Edit Profile)").should("exist");
      cy.get("span:contains(Error occurred)").should("exist");
    });
  });

  it("should open modal and update user on user menu", () => {
    cy.navigateTo("Profile");
    cy.get('[data-testid="user-menu-button"').click();
    cy.get('[data-testid="user-menu-update-button"').click();
    cy.get("h2:contains(Edit Profile)").should("exist");

    checkFirstStep();
    checkSecondStep();
    checkThirdStep();

    cy.interceptWithFixtureHook<{ data: User }>(
      { method: "PUT", url: `/api/v1/users/${user!.id}` },
      "users/user.json",
      (item) => {
        (item.data.age = Number(UPDATED_DATA.age)),
          (item.data.firstName = UPDATED_DATA.name),
          (item.data.lastName = UPDATED_DATA.lastName),
          (item.data.subscribed = UPDATED_DATA.subscribed);
        item.data.subscriptions = UPDATED_DATA.subscriptions;
      }
    );

    cy.get("h4:contains(Updating profile)").should("exist");
    cy.get("button:contains(Submit)").click();

    cy.wait("@interceptRequest").then(() => {
      cy.get("h2:contains(Edit Profile)").should("not.exist");
      cy.get(
        `p:contains(${UPDATED_DATA.name} ${UPDATED_DATA.lastName})`
      ).should("exist");
      cy.get("span:contains(Subscription alerts activated)").should("exist");
      cy.get(`span:contains(${UPDATED_DATA.age})`).should("exist");
    });
  });

  it("should open modal and fail to update user if request fails on user menu", () => {
    cy.navigateTo("Profile");
    cy.get('[data-testid="user-menu-button"').click();
    cy.get('[data-testid="user-menu-update-button"').click();
    cy.get("h2:contains(Edit Profile)").should("exist");

    checkFirstStep();
    checkSecondStep();
    checkThirdStep();

    cy.intercept(
      {
        method: "PUT",
        url: `/api/v1/users/${user!.id}`,
      },
      { forceNetworkError: true }
    ).as("updateUser");

    // Last step
    cy.get("h4:contains(Updating profile)").should("exist");
    cy.get("button:contains(Submit)").click();

    cy.wait("@updateUser").then(() => {
      cy.get("h2:contains(Edit Profile)").should("exist");
      cy.get("span:contains(Error occurred)").should("exist");
    });
  });
});
