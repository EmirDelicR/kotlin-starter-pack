import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { createStore } from "@/store";

import App from "./App";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container!);
const store = createStore();
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

interface CypressWithStore extends Cypress.Cypress {
  store?: typeof store;
}

declare global {
  interface Window {
    Cypress?: CypressWithStore;
  }
}

if (typeof window !== "undefined" && window.Cypress) {
  window.Cypress.store = store;
}
