import React from "react";
import "index.css";
import logo4 from "./../assets/logo4.png";
import Input from "components/Input";
import Button from "components/Button";
import Checkbox from "components/Checkbox";

const Login = () => {
  return (
    <div className="flex flex-col w-full h-full items-center text-center p-3 pb-12 bg-secondary3">
      <div className="mt-3 mb-9 mx-6">
        <img className="-mb-3 mx-auto scale-50" src={logo4} alt="" />
        <p className="text-text1">Freedom and connectivity</p>
      </div>
      <div className="max-w-xl p-6 text-start bg-white rounded-xl shadow-lg">
        <div className="mb-6 px-3 space-y-1">
          <h1 className="text-3xl text-center text-text1 font-medium">
            Sign In
          </h1>
          <p className="text-center text-text1 text-xs">
            Login using your email address and password
          </p>
        </div>
        <form>
          <div className="my-3">
            <Input type="email" label="Email address" />
          </div>
          <div className="my-3">
            <Input type="password" label="Password" />
          </div>
          <div className="my-4 flex flex-row">
            <div className="w-1/2 flex justify-start text-xs">
              <Checkbox />
              <p className="text-text1">Remember me</p>
            </div>
            <div className="w-1/2 flex justify-end text-xs">
              <a href="link" className="text-primary1">Forgot my password</a>
            </div>
          </div>
          <div className="my-3">
            <Button type="submit" label="Login"></Button>
          </div>
        </form>
        <p className="text-text1 text-center text-xs">
          Don't have an account?{" "}
          <a className="text-primary1" href="url">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
