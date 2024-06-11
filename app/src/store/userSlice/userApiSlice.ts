import { ProfileFormData } from '@/features/profile/edit/forms/FormContext';
import baseApi from '@/store/services/baseApiSetup';

import { UserResponse } from './userInterface';

const userApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation<
      UserResponse,
      { formData: ProfileFormData; userId: string }
    >({
      query: ({ formData, userId }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: formData
      })
    })
  })
});

export const { useUpdateUserMutation } = userApiSlice;
