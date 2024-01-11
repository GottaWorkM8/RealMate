// IMPORTS
import React, { useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { Input, Button, Checkbox, Typography } from "@material-tailwind/react";
import logo from "../assets/label.png";
import "index.css";

const Login = () => {
  // STATES OF INPUTS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // STATE OF THE BUTTON
  const [loading, setLoading] = useState(false);

  // STATES OF FIREBASE API ERRORS
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  // SIGN IN
  const { login } = useAuth();
  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      const errorCode = error.code;
      const errorMsg = error.msg;
      setApiErrorMessage("Invalid email address or password.");
      setApiError(true);
      console.error(errorCode, errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full min-h-full items-center text-center p-3 pb-12 bg-secondary-4">
      <div className="flex flex-col mt-3 mb-9 mx-6">
        <img className="scale-50" src={logo} alt="" />
        <p className="-mt-3 text-text-3">Freedom and connectivity</p>
      </div>
      <div className="w-[20rem] sm:w-[30rem] p-6 text-start bg-background rounded-xl shadow-lg">
        <div className="mb-6 px-3 space-y-1">
          <h1 className="text-3xl text-center text-text-2 font-medium">
            Sign In
          </h1>
          <p className="text-center text-text-3 text-sm">
            Login using your email address and password
          </p>
        </div>
        <form onSubmit={handleLogin} noValidate>
          <div className="my-3">
            <Input
              type="email"
              label="Email address"
              maxLength={50}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color="teal"
              className="text-text-1"
              crossOrigin={undefined}
            />
          </div>
          <div className="my-3">
            <Input
              type="password"
              label="Password"
              maxLength={50}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              color="teal"
              className="text-text-1"
              crossOrigin={undefined}
            />
          </div>
          <div className="my-3 flex">
            <div className="w-1/2 flex items-center justify-start text-sm">
              <Checkbox color="teal" crossOrigin={undefined} />
              <p className="text-text-3">Remember me</p>
            </div>
            <div className="w-1/2 flex items-center justify-end text-sm">
              <a href="link" className="text-primary-1">
                Forgot my password
              </a>
            </div>
          </div>
          <div className="items-center text-center">
            <Typography
              variant="small"
              color="red"
              className={`mb-3 ${apiError ? "" : "hidden"}`}
            >
              {apiErrorMessage}
            </Typography>
          </div>
          <div className="my-3">
            <Button
              type="submit"
              size="lg"
              loading={loading}
              color="teal"
              className="w-full justify-center"
            >
              {loading ? "Logging in" : "Login"}
            </Button>
          </div>
        </form>
        <p className="text-text-3 text-center text-sm">
          Don't have an account?{" "}
          <a className="text-primary-1" href="/register">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
