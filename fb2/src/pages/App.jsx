// IMPORTS
import React, { useContext } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Register from "pages/Register";
import Login from "pages/Login";
import CustomNavbar from "components/navbar/CustomNavbar";
import Home from "tabs/Home";
import Chats from "tabs/Chats";
import Friends from "tabs/Friends";
import Groups from "tabs/Groups";
import Notifications from "tabs/Notifications";
import PrivateRoute from "components/PrivateRoute";
import "index.css";

const App = () => {
  return (
    <div className="app h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <CustomNavbar />
              <Outlet />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="chats" element={<Chats />} />
          <Route path="chats/:chatId" element={<Chats />} />
          <Route path="friends" element={<Friends />} />
          <Route path="friends/:category" element={<Friends />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:category" element={<Groups />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
