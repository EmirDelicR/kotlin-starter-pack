import React from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "@/routes/Routes.tsx";
import { createStore } from "@/store";
import { Provider } from "react-redux";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={createStore()}>
      <AppRoutes />
    </Provider>
  </React.StrictMode>
);
