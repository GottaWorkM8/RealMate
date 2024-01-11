// IMPORTS
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Register from "pages/Register";
import Login from "pages/Login";
import CustomNavbar from "components/navbar/CustomNavbar";
import Home from "tabs/Home";
import Chats from "tabs/Chats";
import Friends from "tabs/Friends";
import Groups from "tabs/Groups";
import Notifications from "tabs/Notifications";
import PrivateRoute from "routes/PrivateRoute";
import "index.css";
import PublicRoute from "routes/PublicRoute";
import Profiles from "tabs/UserProfiles";

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
          <Route path="profiles/users/:userId" element={<Profiles />} />
          <Route path="profiles/groups/:groupId" element={<Profiles />} />
        </Route>
        <Route
          path="register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
