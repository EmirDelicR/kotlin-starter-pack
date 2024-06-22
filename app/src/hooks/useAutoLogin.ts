import { useCallback, useState } from 'react';

import { useAutoLoginMutation } from '@/features/auth/store/authApiSlice';
import { useAppDispatch } from '@/store';
import { UserResponse, setUser } from '@/store/userSlice';
import { localStorageHelper } from '@/utils';

import useAsyncEffect from './useAsyncEffect';

/**
 * @description This hook make auto login of the user with token
 */
export default function useAutoLogin() {
  const [isAuth, setIsAuth] = useState<null | boolean>(null);
  const dispatch = useAppDispatch();
  const [autoLogin] = useAutoLoginMutation();
  const [, getToken] = localStorageHelper<string>('token');

  const makeApiCall = useCallback(async () => {
    const token = getToken('token');

    if (!token) {
      return setIsAuth(false);
    }

    try {
      const response = (await autoLogin(token)) as { data: UserResponse };
      if (response?.data && response?.data?.status === 200) {
        dispatch(setUser(response.data));
        setIsAuth(true);
      }
    } catch (e) {
      setIsAuth(false);
    }
  }, []);

  useAsyncEffect(makeApiCall);

  return isAuth;
}
