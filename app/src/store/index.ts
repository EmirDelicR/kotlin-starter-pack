import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import {
  ConfigureStoreOptions,
  combineReducers,
  configureStore
} from '@reduxjs/toolkit';

import { authApiSlice } from '@/features/auth/store/authApiSlice';

import { userStoreSlice } from './userSlice';

const rootReducer = combineReducers({
  [userStoreSlice.name]: userStoreSlice.reducer,
  [authApiSlice.reducerPath]: authApiSlice.reducer
});

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined
) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApiSlice.middleware),
    // TODO @ed set to false if prod!
    devTools: true, // process.env.NODE_ENV !== 'production',
    ...options
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof createStore>;
type AppDispatch = AppStore['dispatch'];
export interface CypressWithStore extends Cypress.Cypress {
  store?: AppStore;
}

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
