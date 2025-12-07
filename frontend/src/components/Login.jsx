import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import axiosInstance from "../utils/axiosConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [isLoginForm, setIsLoginForm] = useState(true);

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axiosInstance.post("/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      dispatch(addUser(res.data.user));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axiosInstance.post("/signup", {
        firstName,
        lastName,
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something Went Wrong");
    }
  };

  const UserIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5 opacity-60"
    >
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      />
    </svg>
  );

  const MailIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5 opacity-60"
    >
      <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.161V6a2 2 0 00-2-2H3z" />
      <path d="M19 8.839l-7.441 3.721a.75.75 0 01-.559 0L3 8.839V14a2 2 0 002 2h10a2 2 0 002-2V8.839z" />
    </svg>
  );

  const LockIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5 opacity-60"
    >
      <path
        fillRule="evenodd"
        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="font-mono flex min-h-full flex-col justify-center items-center border border-base-300 hover:border-primary hover:shadow-xl hover:scale-105 transition-all duration-300 sm:w-130 h-fit p-6 my-4 sm:p-8 sm:my-10 mx-auto rounded-lg bg-base-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="text-center mb-4 sm:mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            {isLoginForm ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="mt-2 text-sm text-base-content/70">
            {isLoginForm ? "Sign in to continue your journey" : "Join us today"}
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-4 sm:space-y-6">
          {!isLoginForm && (
            <div className="grid grid-cols-2 gap-4">
              {/* First Name Field */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold text-base-content mb-2"
                >
                  First Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <UserIcon />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input input-bordered w-full pl-10 bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Rahul"
                  />
                </div>
              </div>
              {/* Last Name Field */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold text-base-content mb-2"
                >
                  Last Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <UserIcon />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input input-bordered w-full pl-10 bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Sharma"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-base-content mb-2"
            >
              Email address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MailIcon />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="input input-bordered w-full pl-10 bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-base-content mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LockIcon />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full pl-10 bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            onClick={isLoginForm ? handleLogin : handleSignUp}
          >
            {isLoginForm ? "Sign In" : "Create Account"}
          </button>

          <div className="divider">or</div>

          <p className="text-center">
            <button
              type="button"
              className="text-base-content/70 hover:text-primary text-lg sm:text-2xl font-medium transition duration-200 underline-offset-4 hover:underline cursor-pointer"
              onClick={() => setIsLoginForm((value) => !value)}
            >
              <span className="text-primary">❯ </span>
              {isLoginForm
                ? "New user? Create an account"
                : "Already have an account? Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
