import baseApi from '@/store/services/baseApiSetup';
import { UserResponse } from '@/store/userSlice';

interface LoginRequestData {
  email: string;
  password: string;
}

interface RegisterRequestData extends LoginRequestData {
  firstName: string;
  lastName: string;
  userName?: string;
}

export const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, LoginRequestData>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials
      })
    }),
    autoLogin: builder.mutation<UserResponse, string>({
      query: (token) => ({
        url: 'autoLogin',
        method: 'POST',
        body: { token }
      })
    }),
    register: builder.mutation<UserResponse, RegisterRequestData>({
      query: (data) => ({
        url: 'register',
        method: 'POST',
        body: data
      })
    })
  }),
  overrideExisting: false
});

export const { useLoginMutation, useRegisterMutation, useAutoLoginMutation } =
  authApiSlice;
