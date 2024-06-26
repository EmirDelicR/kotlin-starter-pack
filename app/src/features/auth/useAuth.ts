import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { NavRoutes } from '@/constants';
import { useAppDispatch } from '@/store';
import { UserResponse, setUser } from '@/store/userSlice';

const useAuth = (response: UserResponse | undefined, isSuccess: boolean) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess && response) {
      dispatch(setUser(response));
      navigate(`/${NavRoutes.HOME}`);
    }
  }, [isSuccess, response]);
};

export default useAuth;
