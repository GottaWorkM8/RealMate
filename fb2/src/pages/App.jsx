// IMPORTS
import "index.css";
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import PrivateRoute from "routes/PrivateRoute";
import PublicRoute from "routes/PublicRoute";
import Register from "pages/Register";
import Login from "pages/Login";
import Home from "tabs/Home";
import Chats from "tabs/Chats";
import Friends from "tabs/Friends";
import Groups from "tabs/Groups";
import Notifications from "tabs/Notifications";
import UserProfile from "tabs/UserProfile";
import GroupProfile from "tabs/GroupProfile";
import UserProfileEdit from "tabs/UserEdit";
import UserProfilePrefs from "tabs/UserPrefs";
import GroupProfileEdit from "tabs/GroupEdit";
import GroupProfilePrefs from "tabs/GroupPrefs";
import CustomNavbar from "components/navbar/CustomNavbar";

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
          <Route path="profile/user/:userId" element={<UserProfile />} />
          <Route
            path="profile/user/edit/:userId"
            element={<UserProfileEdit />}
          />
          <Route
            path="profile/user/settings/:userId"
            element={<UserProfilePrefs />}
          />
          <Route path="profile/group/:groupId" element={<GroupProfile />} />
          <Route path="profile/group/:groupId" element={<GroupProfileEdit />} />
          <Route
            path="profile/group/:groupId"
            element={<GroupProfilePrefs />}
          />
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
