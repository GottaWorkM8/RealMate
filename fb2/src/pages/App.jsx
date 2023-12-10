// IMPORTS
import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Register from "pages/Register";
import Login from "pages/Login";
import CustomNavbar from "components/CustomNavbar";
import Home from "tabs/Home";
import Chats from "tabs/Chats";
import Friends from "tabs/Friends";
import Groups from "tabs/Groups";
import Notifications from "tabs/Notifications";
import "index.css";

const App = () => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // SIGN OUT
  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/login");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  // USER AUTH STATE OBSERVER
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  return (
    <div className="app h-screen">
      <Routes>
        <Route
          element={
            <>
              <CustomNavbar />
              <Outlet />
            </>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
