import { useNavigate } from 'react-router-dom';

import { NavRoutes } from '@/constants';
import { useAppDispatch } from '@/store';
import { logoutUser } from '@/store/userSlice';

export default function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onUserLogoutHandler = () => {
    dispatch(logoutUser());
    navigate(`/${NavRoutes.AUTH}`);
  };

  return onUserLogoutHandler;
}
