import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Roles, SubscriptionType } from "@/constants";
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const INITIAL_USER_DATA_POPULATE: UserState = {
  data: {
    id: "userId",
    age: 23,
    avatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png",
    email: "test@test.com",
    firstName: "John",
    lastName: "Doe",
    userName: "Cabal",
    loggedIn: true,
    profileUpdated: true,
    subscribed: true,
    subscriptions: [
      {
        id: "sub-uuid-1",
        createdAt: "2024-02-24T14:49:32.344Z",
        name: SubscriptionType.NEWS,
        updateAt: "2024-02-24T14:49:32.344Z",
      },
    ],
    token: "dummy-token",
    role: {
      id: "user-role-id",
      type: 2,
      createdAt: new Date("2024-02-24T14:49:32.344Z"),
      updatedAt: new Date("2024-02-24T14:49:32.344Z"),
    },
    createdAt: new Date("2024-02-24T14:49:32.344Z"),
    updatedAt: new Date("2024-02-24T14:49:32.344Z"),
  },
};

export const userStoreSlice = createSlice({
  name: "user",
  initialState: INITIAL_USER_DATA_POPULATE,
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
