import React from "react";
import { createRoot } from "react-dom/client";
import { createStore } from "@/store";
import { Provider } from "react-redux";

import App from "./App";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={createStore()}>
      <App />
    </Provider>
  </React.StrictMode>
);
