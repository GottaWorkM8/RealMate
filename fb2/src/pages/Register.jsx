// IMPORTS
import React, { useState, useRef } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Checkbox,
  Typography,
} from "@material-tailwind/react";
import { DialogTitle } from "@mui/material";
import logo from "../assets/label.png";
import "index.css";
import { useAuth } from "contexts/AuthContext";

// REGISTER COMPONENT
const Register = () => {
  // THEME FOR MUI DATEPICKER
  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(var(--color-primary1)) !important",
      },
      secondary: {
        main: "rgb(var(--color-secondary1)) !important",
      },
    },
    shape: {
      borderRadius: 7,
    },
  });

  // STATES OF INPUTS & DIALOGS
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [birthdate, setBirthdate] = useState(null);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  // STATE OF THE BUTTON
  const [loading, setLoading] = useState(false);

  // STATES OF INPUT ERRORS
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);
  const [birthdateError, setBirthdateError] = useState(false);
  const [checkError, setCheckError] = useState(false);

  // FUNCTIONS FOR CHECKBOX AND DIALOG COOPERATION
  const handleOpen = () => setOpen(!open);
  const handleConfirm = () => {
    setOpen(false);
    setChecked(true);
  };

  // FUNCTIONS FOR INPUT VALIDATION
  const validateFirstName = (fName) => {
    const hasValidCharacters = /^[a-zA-ZĄąĆćĘęŁłŃńÓóŚśŹźŻż]+$/;
    const error = fName.length < 1 || !hasValidCharacters.test(fName);

    setFirstNameError(error);
    return !error;
  };

  const validateLastName = (lName) => {
    const hasValidCharacters = /^[a-zA-ZĄąĆćĘęŁłŃńÓóŚśŹźŻż]+$/;
    const error = lName.length < 1 || !hasValidCharacters.test(lName);

    setLastNameError(error);
    return !error;
  };

  const validateEmail = (mail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasNoWhitespace = /^\S*$/;
    const error =
      !emailRegex.test(mail) ||
      !hasNoWhitespace.test(mail) ||
      mail.trim() !== mail;
    setEmailError(error);
    return !error;
  };

  const validatePassword = (pass) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasNumber = /\d/;
    const hasValidCharacters = /^[a-zA-Z0-9]+$/;
    const error =
      pass.length < minLength ||
      !hasUppercase.test(pass) ||
      !hasLowercase.test(pass) ||
      !hasNumber.test(pass) ||
      !hasValidCharacters.test(pass);

    setPasswordError(error);
    return !error;
  };

  const validateRepeatPassword = (pass, repPass) => {
    const error = repPass !== pass;

    setRepeatPasswordError(error);
    return !error;
  };

  const validateBirthdate = (bDate) => {
    const error =
      !birthdate ||
      isNaN(bDate) ||
      new Date(bDate) > new Date() ||
      new Date(bDate).getFullYear() < 1900;

    setBirthdateError(error);
    return !error;
  };

  const validateCheck = (check) => {
    const error = !check;

    setCheckError(error);
    return !error;
  };

  // REFERENCE TO MUI DATEPICKER (NECESSARY FOR WORKING ONBLUR)
  const datePickerRef = useRef(null);

  // FUNCTION FOR FORM VALIDATION
  const formValid = (fName, lName, mail, pass, repPass, bDate, check) => {
    return (
      validateFirstName(fName) &&
      validateLastName(lName) &&
      validateEmail(mail) &&
      validatePassword(pass) &&
      validateRepeatPassword(pass, repPass) &&
      validateBirthdate(bDate) &&
      validateCheck(check)
    );
  };

  // STATES OF FIREBASE API ERRORS
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  // SIGN UP
  const { register } = useAuth();
  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    setApiError(false);
    const fName = firstName;
    const lName = lastName;
    const mail = email;
    const pass = password;
    const repPass = repeatPassword;
    const bDate = birthdate;
    const check = checked;

    if (formValid(fName, lName, mail, pass, repPass, bDate, check)) {
      try {
        await register(fName, lName, mail, pass, bDate);
      } catch (error) {
        const errorCode = error.code;
        const errorMsg = error.msg;
        if (errorCode === "auth/email-already-in-use") {
          setApiErrorMessage(
            "Use another email address, an account with this address already exists."
          );
          setApiError(true);
        }
        console.error(errorCode, errorMsg);
      }
    } else console.error("User registration failed: Incorrect input data");
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full min-h-full items-center text-center p-3 pb-12 bg-background">
      <div className="flex flex-col mt-3 mb-9 mx-6">
        <img className="scale-50" src={logo} alt="" />
        <p className="-mt-3 text-text-3 ">Freedom and connectivity</p>
      </div>
      <div className="w-[20rem] sm:w-[30rem] p-6 text-start rounded-xl shadow-lg bg-container">
        <div className="mb-6 px-3 space-y-1">
          <h1 className="text-3xl text-center text-text-2 font-medium">
            Sign Up
          </h1>
          <p className="text-center text-text-3 text-sm">
            Provide necessary data to register
          </p>
        </div>
        <form onSubmit={handleRegister} autoComplete="false" noValidate>
          <div className="my-3 flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col w-full sm:w-1/2">
              <Input
                type="text"
                label="First name"
                maxLength={30}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => validateFirstName(firstName)}
                color="teal"
                className="text-text-1"
              />
              <Typography
                variant="small"
                color="red"
                className={` ${!firstNameError && "hidden"}`}
              >
                Use at least one letter, no numbers or special characters.
              </Typography>
            </div>
            <div className="flex flex-col w-full sm:w-1/2">
              <Input
                type="text"
                label="Last name"
                maxLength={30}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => validateLastName(lastName)}
                color="teal"
                className="text-text-1"
              />
              <Typography
                variant="small"
                color="red"
                className={` ${!lastNameError && "hidden"}`}
              >
                Use at least one letter, no numbers or special characters.
              </Typography>
            </div>
          </div>
          <div className="my-3">
            <Input
              type="email"
              label="Email address"
              maxLength={50}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateEmail(email)}
              color="teal"
              className="text-text-1"
            />
            <Typography
              variant="small"
              color="red"
              className={`mb-3 ${!emailError && "hidden"}`}
            >
              Use a valid email address.
            </Typography>
          </div>
          <div className="my-3">
            <Input
              type="password"
              label="Password"
              maxLength={50}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onBlur={() => validatePassword(password)}
              color="teal"
              className="text-text-1"
            />
            <Typography
              variant="small"
              color="red"
              className={`mb-3 ${!passwordError && "hidden"}`}
            >
              Use at least 8 characters, one uppercase, one lowercase and one
              number, without any special characters.
            </Typography>
          </div>
          <div className="my-3">
            <Input
              type="password"
              label="Repeat password"
              maxLength={50}
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              onBlur={() => validateRepeatPassword(password, repeatPassword)}
              color="teal"
              className="text-text-1"
            />
            <Typography
              variant="small"
              color="red"
              className={`mb-3 ${repeatPasswordError ? "" : "hidden"}`}
            >
              Repeat the password above.
            </Typography>
          </div>
          <div className="my-3 w-full sm:w-1/2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <div onBlur={() => validateBirthdate(birthdate)}>
                  <DatePicker
                    label="Birthdate"
                    format="DD-MM-YYYY"
                    openTo="year"
                    views={["year", "month", "day"]}
                    disableFuture
                    disableHighlightToday
                    value={birthdate}
                    onChange={(date) => setBirthdate(new Date(date))}
                    ref={datePickerRef}
                    slotProps={{
                      textField: { size: "small" },
                      openPickerButton: {
                        color: "secondary",
                      },
                    }}
                    sx={{
                      width: "100%",
                      "& .MuiInputLabel-root": {
                        color: "#607d8b", // blue gray 500
                        fontSize: "14px",
                        fontFamily: "Open Sans",
                        padding: "1px 0",
                      },
                      "& .MuiInputLabel-shrink": {
                        color: "#78909c", // blue gray 400
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #b0bec5", // blue gray 200
                      },
                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                        {
                          border: "2px solid #b0bec5", // blue gray 200
                        },
                      "& .MuiButtonBase-root:hover": {
                        color: "rgb(var(--color-primary1)) !important",
                        backgroundColor:
                          "rgb(var(--color-secondary4)) !important",
                      },
                      "& input": {
                        fontSize: "14px",
                        fontFamily: "system-ui",
                        padding: "10px 13px",
                      },
                    }}
                  />
                </div>
              </ThemeProvider>
            </LocalizationProvider>
            <Typography
              variant="small"
              color="red"
              className={`mb-3 ${!birthdateError && "hidden"}`}
            >
              Pick a valid birth date.
            </Typography>
          </div>
          <div className="flex flex-col">
            <div className="flex text-sm">
              <Checkbox
                checked={checked}
                onChange={() => setChecked(!checked)}
                onBlur={() => validateCheck(checked)}
                color="teal"
              />
              <div className="flex flex-row items-center">
                <p className="text-text-3">
                  I read and agree to{" "}
                  <button
                    type="button"
                    onClick={handleOpen}
                    className="text-primary-1"
                  >
                    Terms & Conditions
                  </button>
                  <Dialog
                    open={open}
                    handler={handleOpen}
                    className="bg-background"
                  >
                    <DialogHeader className="text-text-2">
                      RealMate Terms & Conditions
                    </DialogHeader>
                    <DialogBody className="h-dialog overflow-auto text-text-3">
                      Last Updated: [01-12-2023]
                      <br />
                      <br />
                      Welcome to RealMate, a social networking application
                      connecting people worldwide. Before using RealMate, please
                      read the following Terms and Conditions carefully. By
                      using RealMate, you agree to be bound by these Terms. If
                      you do not agree to these Terms, please refrain from using
                      the App.
                      <DialogTitle className="text-text-2">
                        1. Account Registration
                      </DialogTitle>
                      1.1 To use RealMate, you must create an account by
                      providing accurate and complete information, including
                      your first name, last name, email address, date of birth,
                      and a secure password. <br />
                      1.2 You are responsible for maintaining the
                      confidentiality of your account credentials and for all
                      activities that occur under your account.
                      <DialogTitle className="text-text-2">
                        2. Data Collection and Usage
                      </DialogTitle>
                      2.1 RealMate collects and stores user data, including but
                      not limited to first name, last name, email address,
                      password, date of birth, personal pictures, and sent
                      messages. <br />
                      2.2 By using RealMate, you grant us the right to use your
                      data to provide and improve our services, personalize your
                      experience, and communicate with you. <br />
                      2.3 RealMate may use cookies and sessions to enhance user
                      experience, analyze usage patterns, and improve the
                      overall functionality of the App.
                      <DialogTitle className="text-text-2">
                        3. Privacy and Security
                      </DialogTitle>
                      3.1 RealMate is committed to protecting your privacy. Our
                      Privacy Policy outlines how your data is collected, used,
                      and secured. By using RealMate, you acknowledge and agree
                      to the terms of our Privacy Policy. <br />
                      3.2 You are responsible for maintaining the security of
                      your account. Notify RealMate immediately of any
                      unauthorized access or use of your account.
                      <DialogTitle className="text-text-2">
                        4. Content and Conduct
                      </DialogTitle>
                      4.1 You are solely responsible for the content you post on
                      RealMate. Do not share content that violates applicable
                      laws, infringes on intellectual property rights, or is
                      offensive or harmful. <br />
                      4.2 RealMate has the right to monitor and moderate
                      content. Inappropriate content may be removed, and users
                      may be suspended or banned at our discretion.
                      <DialogTitle className="text-text-2">
                        5. Termination
                      </DialogTitle>
                      5.1 RealMate reserves the right to suspend or terminate
                      your account at any time, for any reason, without notice.{" "}
                      <br />
                      5.2 Upon termination, your access to the App and any
                      associated data may be permanently deleted.
                      <DialogTitle className="text-text-2">
                        6. Updates and Changes
                      </DialogTitle>
                      6.1 RealMate may update these Terms at any time. By
                      continuing to use the App after changes are posted, you
                      agree to the updated Terms. <br />
                      6.2 RealMate may update the App to improve functionality
                      and security. You are responsible for keeping the App up
                      to date.
                    </DialogBody>
                    <DialogFooter className="space-x-2">
                      <Button
                        variant="text"
                        color="blue-gray"
                        onClick={handleOpen}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="text"
                        color="teal"
                        onClick={handleConfirm}
                      >
                        Confirm
                      </Button>
                    </DialogFooter>
                  </Dialog>
                </p>
              </div>
            </div>
            <Typography
              variant="small"
              color="red"
              className={`mb-3 ${!checkError && "hidden"}`}
            >
              Accept Terms & Conditions.
            </Typography>
          </div>
          <div className="items-center text-center">
            <Typography
              variant="small"
              color="red"
              className={`mb-3 ${!apiError && "hidden"}`}
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
              {loading ? "Creating an account" : "Create an account"}
            </Button>
          </div>
        </form>
        <p className="text-text-3 text-center text-sm">
          Already have an account?{" "}
          <a className="text-primary-1" href="/login">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
