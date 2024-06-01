import baseApi from "@/store/services/baseApiSetup";

import { UserResponse } from "./userInterface";

export const userApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation<
      UserResponse,
      { formData: FormData; userId: string }
    >({
      query: ({ formData, userId }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const { useUpdateUserMutation } = userApiSlice;
