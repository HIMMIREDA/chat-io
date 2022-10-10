import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logoutUser, setUser } from "../features/auth/authSlice";
import Spinner from "./Spinner";
import { useEffect } from "react";
import axios from "../api/axios";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // try getting new access token using refresh token
    let isMounted = true;
    const abortController = new AbortController();
    const verifyRefresh = async () => {
      try {
        const response = await axios.get("/refresh", {
          signal: abortController.signal,
        });
        if (isMounted) {
          dispatch(setUser(response.data));
          dispatch({
            type: "socket/connect",
            payload: { token: response.data.accessToken },
          });
          setIsLoading(false);
        }
      } catch (error) {
        if (error.name !== "CanceledError") {
          setIsLoading(false);
          dispatch(logoutUser());
          navigate("/login");
        }
      }
    };

    !user?.accessToken ? verifyRefresh() : setIsLoading(false);
    return () => {
      isMounted = false;
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Spinner fixed={true} />;
  }
  return <Outlet />;
};

export default PersistLogin;
