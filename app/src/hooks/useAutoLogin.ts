import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAutoLoginMutation } from "@/features/auth/store/authApiSlice";
import { useAppDispatch } from "@/store";
import { UserResponse, setUser } from "@/store/userSlice";
import { localStorageHelper } from "@/utils";

import useAsyncEffect from "./useAsyncEffect";

/**
 * @description This hook make auto login of the user with token
 */
export default function useAutoLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [autoLogin] = useAutoLoginMutation();
  const [, getToken] = localStorageHelper<string>("token");

  const makeApiCall = useCallback(async () => {
    const token = getToken("token");

    if (!token) {
      return navigate("/auth");
    }

    const response = (await autoLogin(token)) as { data: UserResponse };
    if (response?.data && response?.data?.status === 200) {
      dispatch(setUser(response.data));
    }
  }, []);

  useAsyncEffect(makeApiCall);
}
