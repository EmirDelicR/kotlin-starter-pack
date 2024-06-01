import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Roles } from "@/constants";
import { RootState } from "@/store";
import { localStorageHelper } from "@/utils";

import { UserState } from "./userInterface";

export const INITIAL_USER_DATA: UserState = {
  data: {
    age: null,
    avatar: "",
    email: "",
    firstName: "",
    id: "",
    loggedIn: false,
    profileUpdated: false,
    subscribed: false,
    lastName: "",
    subscriptions: [],
    token: null,
    userName: "",
    role: null,
  },
};

export const userStoreSlice = createSlice({
  name: "user",
  initialState: INITIAL_USER_DATA,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      const [setToken] = localStorageHelper<string | null>("token");
      const { data } = action.payload;
      setToken(data.token);
      state.data = data;
    },
    logoutUser: (state) => {
      const [setToken] = localStorageHelper<string | null>("token");
      setToken(null);
      state.data = INITIAL_USER_DATA.data;
    },
  },
});

export const { setUser, logoutUser } = userStoreSlice.actions;

export const selectUser = (state: RootState) => state.user.data;
export const selectIsUserProfileUpdated = (state: RootState) =>
  state.user.data.profileUpdated;
export const selectToken = (state: RootState) => state.user.data.token;
export const selectIsUserLoggedIn = (state: RootState) =>
  state.user.data.loggedIn;
export const selectUserId = (state: RootState) => state.user.data.id;
export const selectIsUserAdmin = (state: RootState) =>
  state.user.data.role?.type === Roles.ADMIN;
