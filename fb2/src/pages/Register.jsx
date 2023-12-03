// IMPORTS
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  updateProfile,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import "index.css";
import logo4 from "./../assets/logo4.png";
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

// REGISTER COMPONENT
const Register = () => {
  // THEME FOR THE MUI DATEPICKER
  const theme = createTheme({
    palette: {
      primary: {
        main: "#009688", // teal 500
      },
      secondary: {
        main: "#90a4ae", // blue gray 300
      },
    },
    shape: {
      borderRadius: 7,
    },
  });

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // STATES OF INPUTS
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [birthdate, setBirthdate] = useState(null);

  // STATES OF INPUT ERRORS
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);
  const [birthdateError, setBirthdateError] = useState(false);

  // BEHAVIOR FOR CHECKBOX AND DIALOG COOPERATION
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const [checked, setChecked] = React.useState(false);
  const handleConfirm = () => {
    setOpen(false);
    setChecked(true);
  };

  // FUNCTIONS FOR INPUT VALIDATION
  const validateFirstName = () => {
    const hasValidCharacters = /^[a-zA-Z]+$/;

    setFirstNameError(
      firstName.length < 1 || !hasValidCharacters.test(firstName)
    );
  };

  const validateLastName = () => {
    const hasValidCharacters = /^[a-zA-Z]+$/;

    setLastNameError(lastName.length < 1 || !hasValidCharacters.test(lastName));
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasNoWhitespace = /^\S*$/;

    setEmailError(
      !emailRegex.test(email) ||
        !hasNoWhitespace.test(email) ||
        email.trim() !== email
    );
  };

  const validatePassword = () => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasNumber = /\d/;
    const hasValidCharacters = /^[a-zA-Z0-9]+$/;

    setPasswordError(
      password.length < minLength ||
        !hasUppercase.test(password) ||
        !hasLowercase.test(password) ||
        !hasNumber.test(password) ||
        !hasValidCharacters.test(password)
    );
  };

  const validateRepeatPassword = () => {
    setRepeatPasswordError(repeatPassword !== password);
  };

  const validateBirthdate = () => {
    setBirthdateError(
      !birthdate ||
        isNaN(birthdate) ||
        new Date(birthdate) > new Date() ||
        new Date(birthdate).getFullYear() < 1900
    );
  };

  // ONBLUR EVENT
  const handleBlur = (validator) => () => {
    validator();
  };

  // STATE OF FORM VALIDATION
  const [formValid, setFormValid] = useState(false);

  const validateForm = () => {
    setFormValid(
      !firstNameError &&
        !(firstName.length === 0) &&
        !lastNameError &&
        !(lastName.length === 0) &&
        !emailError &&
        !(email.length === 0) &&
        !passwordError &&
        !(password.length === 0) &&
        !repeatPasswordError &&
        !(repeatPassword.length === 0) &&
        !birthdateError &&
        !(birthdate === null) &&
        checked
    );
  };

  useEffect(() => {
    validateForm();
  });

  // SIGN UP
  const register = async (e) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, {
          displayName: "johnnyboi",
          photoURL: "https://example.com/jane-q-user/profile.jpg",
        })
          .then(() => {
            // Profile updated!
            // ...
          })
          .catch((error) => {
            // An error occurred
            // ...
          });
        console.log(user);
        navigate("/login");
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
        <p className="text-text3 ">Freedom and connectivity</p>
      </div>
      <div className="max-w-xl p-6 text-start bg-white rounded-xl shadow-lg">
        <div className="mb-6 px-3 space-y-1">
          <h1 className="text-3xl text-center text-text1 font-medium">
            Sign Up
          </h1>
          <p className="text-center text-text3 text-sm">
            Provide necessary data to register
          </p>
        </div>
        <form onSubmit={register} autoComplete="false">
          <div className="my-3 flex flex-row space-x-3">
            <div className="flex flex-col w-1/2">
              <Input
                type="text"
                label="First name"
                maxLength={30}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={handleBlur(validateFirstName)}
                color="teal"
                crossOrigin={undefined}
              />
              <Typography
                variant="small"
                color="red"
                className={` ${firstNameError ? "" : "hidden"}`}
              >
                Use at least one letter, no numbers or special characters.
              </Typography>
            </div>
            <div className="flex flex-col w-1/2">
              <Input
                type="text"
                label="Last name"
                maxLength={30}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={handleBlur(validateLastName)}
                color="teal"
                crossOrigin={undefined}
              />
              <Typography
                variant="small"
                color="red"
                className={` ${lastNameError ? "" : "hidden"}`}
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
              onBlur={handleBlur(validateEmail)}
              color="teal"
              crossOrigin={undefined}
            />
            <Typography
              variant="small"
              color="red"
              className={`mb-3 ${emailError ? "" : "hidden"}`}
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
              onBlur={handleBlur(validatePassword)}
              color="teal"
              crossOrigin={undefined}
            />
            <Typography
              variant="small"
              color="red"
              className={`mb-3 ${passwordError ? "" : "hidden"}`}
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
              onBlur={handleBlur(validateRepeatPassword)}
              color="teal"
              crossOrigin={undefined}
            />
            <Typography
              variant="small"
              color="red"
              className={`mb-3 ${repeatPasswordError ? "" : "hidden"}`}
            >
              Repeat the password above.
            </Typography>
          </div>
          <div className="my-3">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <DatePicker
                  label="Birthdate"
                  format="DD-MM-YYYY"
                  openTo="year"
                  views={["year", "month", "day"]}
                  disableFuture
                  disableHighlightToday
                  value={birthdate}
                  onChange={(date) => setBirthdate(date)}
                  onError={validateBirthdate}
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
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        border: "1px solid #b0bec5", // blue gray 200
                      },
                    "& .MuiButtonBase-root:hover": {
                      color: "#009688", // teal 500
                      backgroundColor: "#eceff1", // blue gray 50
                    },
                    "& input": {
                      color: "#455a64", // blue gray 700
                      fontSize: "14px",
                      fontFamily: "system-ui",
                      padding: "10px 13px",
                    },
                  }}
                />
              </ThemeProvider>
            </LocalizationProvider>
            <Typography
              variant="small"
              color="red"
              className={`mb-3 ${birthdateError ? "" : "hidden"}`}
            >
              Pick a valid birth date.
            </Typography>
          </div>
          <div className="flex text-sm">
            <Checkbox
              checked={checked}
              onChange={() => setChecked(!checked)}
              color="teal"
              crossOrigin={undefined}
            ></Checkbox>
            <div className="flex flex-row items-center">
              <p className="text-text3">
                I read and agree to{" "}
                <button
                  type="button"
                  onClick={handleOpen}
                  className="text-primary1"
                >
                  Terms & Conditions
                </button>
                <Dialog open={open} handler={handleOpen}>
                  <DialogHeader>RealMate Terms & Conditions</DialogHeader>
                  <DialogBody className="h-[32rem] overflow-y-scroll">
                    Last Updated: [01-12-2023]
                    <br />
                    <br />
                    Welcome to RealMate, a social networking application
                    connecting people worldwide. Before using RealMate, please
                    read the following Terms and Conditions carefully. By using
                    RealMate, you agree to be bound by these Terms. If you do
                    not agree to these Terms, please refrain from using the App.
                    <DialogTitle>1. Account Registration</DialogTitle>
                    1.1 To use RealMate, you must create an account by providing
                    accurate and complete information, including your first
                    name, last name, email address, date of birth, and a secure
                    password. <br />
                    1.2 You are responsible for maintaining the confidentiality
                    of your account credentials and for all activities that
                    occur under your account.
                    <DialogTitle>2. Data Collection and Usage</DialogTitle>
                    2.1 RealMate collects and stores user data, including but
                    not limited to first name, last name, email address,
                    password, date of birth, personal pictures, and sent
                    messages. <br />
                    2.2 By using RealMate, you grant us the right to use your
                    data to provide and improve our services, personalize your
                    experience, and communicate with you. <br />
                    2.3 RealMate may use cookies and sessions to enhance user
                    experience, analyze usage patterns, and improve the overall
                    functionality of the App.
                    <DialogTitle>3. Privacy and Security</DialogTitle>
                    3.1 RealMate is committed to protecting your privacy. Our
                    Privacy Policy outlines how your data is collected, used,
                    and secured. By using RealMate, you acknowledge and agree to
                    the terms of our Privacy Policy. <br />
                    3.2 You are responsible for maintaining the security of your
                    account. Notify RealMate immediately of any unauthorized
                    access or use of your account.
                    <DialogTitle>4. Content and Conduct</DialogTitle>
                    4.1 You are solely responsible for the content you post on
                    RealMate. Do not share content that violates applicable
                    laws, infringes on intellectual property rights, or is
                    offensive or harmful. <br />
                    4.2 RealMate has the right to monitor and moderate content.
                    Inappropriate content may be removed, and users may be
                    suspended or banned at our discretion.
                    <DialogTitle>5. Termination</DialogTitle>
                    5.1 RealMate reserves the right to suspend or terminate your
                    account at any time, for any reason, without notice. <br />
                    5.2 Upon termination, your access to the App and any
                    associated data may be permanently deleted.
                    <DialogTitle>6. Updates and Changes</DialogTitle>
                    6.1 RealMate may update these Terms at any time. By
                    continuing to use the App after changes are posted, you
                    agree to the updated Terms. <br />
                    6.2 RealMate may update the App to improve functionality and
                    security. You are responsible for keeping the App up to
                    date.
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
                      variant="gradient"
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
          <div className="my-3">
            <Button
              type="submit"
              size="lg"
              color="teal"
              disabled={!formValid}
              className="w-full"
            >
              Create an account
            </Button>
          </div>
        </form>
        <p className="text-text3 text-center text-sm">
          Already have an account?{" "}
          <a className="text-primary1" href="/login">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
