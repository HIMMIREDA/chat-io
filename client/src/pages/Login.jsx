import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { reset, loginUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Spinner from "../components/Spinner";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const { loading, isError, isSuccess, message, user } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
    if (isSuccess) {
      dispatch(reset());
      navigate("/chat");
    }
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch, navigate]);

  if (loading) {
    return <Spinner />;
  }
  return user ? (
    <Navigate to="/chat" />
  ) : (
    <div className="mx-auto container h-screen flex items-center">
      <form
        className="w-full  flex flex-col items-center space-y-5 shadow-2xl bg-dark2 p-10"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-4xl md:text-3xl text-accent mb-3">
          Login
        </h1>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Email:</span>
          </label>
          <input
            type="email"
            placeholder="your email"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Password:</span>
          </label>
          <input
            type="password"
            placeholder="your password"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <button className="btn bg-accent text-white" type="submit">
            Login
          </button>
        </div>
        <div>
          No Account yet ?{" "}
          <Link to="/register" className="text-accent">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
