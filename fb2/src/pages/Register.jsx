import React from "react";
import "index.css";
import logo4 from "./../assets/logo4.png";
import Input from "components/Input";
import Button from "components/Button";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Checkbox from "components/Checkbox";

const Register = () => {
  return (
    <div className="flex flex-col w-full h-full items-center text-center p-3 pb-12 bg-secondary3">
      <div className="mt-3 mb-9 mx-6">
        <img className="-mb-3 mx-auto scale-50" src={logo4} alt="" />
        <p className="text-text1">Freedom and connectivity</p>
      </div>
      <div className="max-w-xl p-6 text-start bg-white rounded-xl shadow-lg">
        <div className="mb-6 px-3 space-y-1">
          <h1 className="text-3xl text-center text-text1 font-medium">
            Sign Up
          </h1>
          <p className="text-center text-text1 text-xs">
            Provide necessary data to register
          </p>
        </div>
        <form autoComplete="false">
          <div className="my-3 flex flex-row space-x-3">
            <Input type="text" label="First name" required />
            <Input type="text" label="Last name" required />
          </div>
          <div className="my-3">
            <Input type="email" label="Email address" required />
          </div>
          <div className="my-3">
            <Input type="password" label="Password" required />
          </div>
          <div className="my-3">
            <Input type="password" label="Repeat password" disabled required />
          </div>
          <div className="my-3">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Birthdate"
                format="DD-MM-YYYY"
                openTo="year"
                views={["year", "month", "day"]}
                disableFuture
                disableHighlightToday
                slotProps={{
                  textField: { size: "small" },
                  openPickerButton: {
                    color: "secondary",
                  },
                }}
                sx={{
                  width: "100%",
                  backgroundColor: "#ecfdf5",
                  "& .MuiInputLabel-root": {
                    color: "#94a3b8", // slate 400
                    fontSize: "14px",
                    fontFamily: "Open Sans",
                    padding: "1px 0",
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#10b981" }, // emerald 500
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #94a3b8", // slate 400
                  },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                    { border: "1px solid #94a3b8" }, // slate 400
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    { border: "2px solid #10b981" }, // emerald 500
                  "& .MuiButtonBase-root:hover": {
                    color: "#10b981",
                    backgroundColor: "#f1f5f9", // slate 100
                  },
                  "& input": {
                    color: "#4b5563", // gray 600
                    fontSize: "14px",
                    fontFamily: "system-ui",
                    padding: "10px 13px",
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="my-4 flex text-xs">
            <Checkbox required/>
            <p className="text-text1">
              I read and agree to{" "}
              <a href="link" className="text-primary1">
                Terms & Conditions
              </a>
            </p>
          </div>
          <div className="my-3">
            <Button label="Create an account"></Button>
          </div>
        </form>
        <p className="text-text1 text-center text-xs">
          Already have an account?{" "}
          <a className="text-primary1" href="url">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
