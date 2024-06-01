import {
  createApi,
  fetchBaseQuery,
  type FetchArgs,
  type BaseQueryApi,
} from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/constants";
import { RootState } from "@/store";
// import { UserResponse, logoutUser, setUser } from "@/store/userSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.data.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

async function baseQueryWithReAuth(
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>
) {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    /** Get new token from endpoint */
    const refreshData = await baseQuery("/refresh", api, extraOptions);

    // if (refreshData?.data) {
    //   const { data } = refreshData.data as UserResponse;
    //   const userData = (api.getState() as RootState).user.data;
    //   /** Update token in state */
    //   api.dispatch(
    //     setUser({
    //       data: {
    //         ...userData,
    //         ...data,
    //       },
    //     })
    //   );

    //   result = await baseQuery(args, api, extraOptions);
    // } else {
    //   /** Logout user */
    //   api.dispatch(logoutUser());
    // }
  }

  return result;
}

const baseApi = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
});

export default baseApi;
