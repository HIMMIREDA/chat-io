import React from "react";
import { useRef } from "react";
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
  const verified = useRef(false);

  useEffect(() => {
    // try getting new access token using refresh token
    const verifyRefresh = async () => {
      try {
        const response = await axios.get("/refresh");
        dispatch(setUser(response.data));
        dispatch({ type: "socket/connect", payload: null });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        dispatch(logoutUser());
        navigate("/login");
      }
    };

    !user?.accessToken && !verified.current && verifyRefresh();
    return () => (verified.current = true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Spinner />;
  }
  return <Outlet />;
};

export default PersistLogin;
