// IMPORTS
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { Input, Button, Checkbox } from "@material-tailwind/react";
import { auth } from "../firebase";
import logo from "../assets/label.png";
import "index.css";

const Login = () => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // STATES OF INPUTS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // SIGN IN
  const login = (e) => {
    e.preventDefault();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            navigate("/");
            console.log(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <div className="flex flex-col w-full items-center text-center p-3 pb-12 bg-secondary-4">
      <div className="mt-3 mb-9 mx-6">
        <img className="-mb-3 mx-auto scale-50" src={logo} alt="" />
        <p className="text-text-3">Freedom and connectivity</p>
      </div>
      <div className="max-w-xl p-6 text-start bg-background rounded-xl shadow-lg">
        <div className="mb-6 px-3 space-y-1">
          <h1 className="text-3xl text-center text-text-1 font-medium">
            Sign In
          </h1>
          <p className="text-center text-text-3 text-sm">
            Login using your email address and password
          </p>
        </div>
        <form noValidate>
          <div className="my-3">
            <Input
              type="email"
              label="Email address"
              maxLength={50}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color="teal"
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
