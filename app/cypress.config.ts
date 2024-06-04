import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.{ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    fixturesFolder: "cypress/fixtures",
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
