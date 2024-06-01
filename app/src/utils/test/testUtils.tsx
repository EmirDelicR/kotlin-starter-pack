import React, { PropsWithChildren, ReactElement } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { render, renderHook, screen } from "@testing-library/react";
import type { RenderHookOptions, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppStore, RootState, createStore } from "@/store";

// https://redux.js.org/usage/writing-tests

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState | Record<string, unknown>>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createStore({ preloadedState }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({
    children,
  }: PropsWithChildren<Record<string, unknown>>): ReactElement {
    return (
      <BrowserRouter>
        <Provider store={store}>{children}</Provider>
      </BrowserRouter>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

interface ExtendedRenderHookOptions<TProps> extends RenderHookOptions<TProps> {
  preloadedState?: Partial<RootState | Record<string, unknown>>;
  store?: AppStore;
}

export function renderHookWithProviders<TProps, TResult>(
  hook: (props: TProps) => TResult,
  {
    preloadedState = {},
    store = createStore({ preloadedState }),
    ...renderHookOptions
  }: ExtendedRenderHookOptions<TProps> = {}
) {
  function Wrapper({
    children,
  }: PropsWithChildren<Record<string, unknown>>): ReactElement {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...renderHook(hook, { wrapper: Wrapper, ...renderHookOptions }),
  };
}

/** Helpers */
export const typeDataInInputField = async (fieldName: string, text: string) => {
  await userEvent.type(screen.getByRole("textbox", { name: fieldName }), text, {
    delay: 1,
  });
};
