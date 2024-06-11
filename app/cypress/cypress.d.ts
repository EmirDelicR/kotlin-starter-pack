declare namespace Cypress {
  interface Chainable {
    login(asAdmin?: boolean): Chainable<void>;
    navigateTo(route: Routes): Chainable<void>;
    interceptWithFixtureHook<T>(
      url: { method: string; url: string },
      fixturePath: string,
      fixtureHook: FixtureHook<T>
    ): void;
  }
}
