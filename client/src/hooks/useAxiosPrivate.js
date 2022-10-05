import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosPrivate } from "../api/axios";
import { setAccessToken } from "../features/auth/authSlice";

function useAxiosPrivate() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const refreshToken = async () => {
      const response = await axiosPrivate.get("/users/refresh");
      dispatch(setAccessToken(response.data.accessToken));
      return response.data.accessToken;
    };

    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth.user?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequestConfig = error?.config;
        if (
          error?.response?.status === 401 &&
          error?.response?.data?.message === "jwt expired" &&
          !prevRequestConfig?.retry
        ) {
          prevRequestConfig.retry = true; // to prevent successive multiple calls of interceptors
          const newAccessToken = await refreshToken();

          prevRequestConfig.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          // retry original request
          return axiosPrivate(prevRequestConfig);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      // clear interceptors when the effect reruns
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch, auth.user.accessToken]);

  return axiosPrivate;
}

export default useAxiosPrivate;
