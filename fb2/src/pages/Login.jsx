// IMPORTS
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { NavLink, useNavigate } from "react-router-dom";
import "index.css";
import logo4 from "./../assets/logo4.png";
import { Input, Button, Checkbox } from "@material-tailwind/react";

const Login = () => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // STATES OF INPUTS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // SIGN IN
  const login = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/home");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <div className="flex flex-col w-full h-full items-center text-center p-3 pb-12 bg-secondary2">
      <div className="mt-3 mb-9 mx-6">
        <img className="-mb-3 mx-auto scale-50" src={logo4} alt="" />
        <p className="text-text3">Freedom and connectivity</p>
      </div>
      <div className="max-w-xl p-6 text-start bg-white rounded-xl shadow-lg">
        <div className="mb-6 px-3 space-y-1">
          <h1 className="text-3xl text-center text-text1 font-medium">
            Sign In
          </h1>
          <p className="text-center text-text3 text-sm">
            Login using your email address and password
          </p>
        </div>
        <form>
          <div className="my-3">
            <Input
              type="email"
              label="Email address"
              onChange={(e) => setEmail(e.target.value)}
              color="teal"
              crossOrigin={undefined}
            />
          </div>
          <div className="my-3">
            <Input
              type="password"
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              color="teal"
              crossOrigin={undefined}
            />
          </div>
          <div className="my-3 flex">
            <div className="w-1/2 flex items-center justify-start text-sm">
              <Checkbox color="teal" crossOrigin={undefined} />
              <p className="text-text3">Remember me</p>
            </div>
            <div className="w-1/2 flex items-center justify-end text-sm">
              <a href="link" className="text-primary1">
                Forgot my password
              </a>
            </div>
          </div>
          <div className="my-3">
            <Button
              type="submit"
              onClick={login}
              size="lg"
              color="teal"
              className="w-full"
            >
              Login
            </Button>
          </div>
        </form>
        <p className="text-text3 text-center text-sm">
          Don't have an account?{" "}
          <a className="text-primary1" href="/register">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
