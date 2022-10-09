import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { reset, registerUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Spinner from "../components/Spinner";

function Register() {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const { loading, isError, isSuccess, message, user } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ email, password, username }));
  };

  useEffect(() => {
    if (isError) {
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
        className="w-full  flex flex-col items-center space-y-5 shadow-2xl bg-base-100 p-10"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-4xl md:text-3xl text-accent mb-3">
          Sign Up
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
            <span className="label-text">Username:</span>
          </label>
          <input
            type="text"
            placeholder="your username"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => setUsername(e.target.value)}
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
            Register
          </button>
        </div>
        <div>
          Already have an account ?{" "}
          <Link to="/login" className="text-accent">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
