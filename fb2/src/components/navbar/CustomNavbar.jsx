// @ts-nocheck
// IMPORTS
import React, { useState, useEffect } from "react";
import { IconButton, Navbar, Tooltip } from "@material-tailwind/react";
import CustomProfileMenu from "./CustomProfileMenu";
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  UserGroupIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  UsersIcon as UsersIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  BellIcon as BellIconSolid,
} from "@heroicons/react/24/solid";
import Headroom from "react-headroom";
import logo from "assets/icon-circle.png";
import CustomNotificationMenu from "./CustomNotificationMenu";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getGroupKeywordSetsData,
  getGroupProfileData,
  getUserKeywordSetsData,
  getUserProfileData,
} from "apis/firebase";
import CustomNavbarSearchInput from "components/inputs/CustomNavbarSearchInput";

const CustomNavbar = () => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  // HANDLING DESKTOP/MOBILE MODES
  const [desktopMode, setDesktopMode] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setDesktopMode(window.innerWidth >= 720);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // HANDLING TABS
  const [activeTab, setActiveTab] = useState(null);
  const handleTabClick = (tabId) => {
    switch (tabId) {
      case 0:
        navigate("/");
        break;
      case 1:
        navigate("/chats");
        break;
      case 2:
        navigate("/friends");
        break;
      case 3:
        navigate("/groups");
        break;
      case 4:
        navigate("/notifications");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/chats")) {
      setActiveTab(1);
    } else if (path.startsWith("/friends")) {
      setActiveTab(2);
    } else if (path.startsWith("/groups")) {
      setActiveTab(3);
    } else if (path.startsWith("/notifications")) {
      setActiveTab(4);
    } else if (path.startsWith("/profile")) {
      setActiveTab(null);
    } else if (path.startsWith("/")) {
      setActiveTab(0);
    } else {
      setActiveTab(null);
    }
  }, [location.pathname]);

  // SEARCHING FOR USERS AND GROUPS
  const [foundUsers, setFoundUsers] = useState([]);
  const [foundGroups, setFoundGroups] = useState([]);

  const handleSearch = async (term) => {
    const users = await getUserKeywordSetsData(term, 4);
    const groups = await getGroupKeywordSetsData(term, 2);
    const matchedUsers = [];
    const matchedGroups = [];
    for (const user of users) {
      const userProfile = await getUserProfileData(user.id);
      if (userProfile) matchedUsers.push(userProfile);
    }
    setFoundUsers(matchedUsers);
    for (const group of groups) {
      const groupProfile = await getGroupProfileData(group.id);
      if (groupProfile) matchedGroups.push(groupProfile);
    }
    setFoundGroups(matchedGroups);
  };

  // HANDLING USER AND GROUP RESULT CLICK
  const handleUserResultClick = (userId) => {
    navigate(`/profile/user/${userId}`);
  };
  const handleGroupResultClick = (groupId) => {
    navigate(`/profile/group/${groupId}`);
  };

  return (
    <Headroom pin={desktopMode}>
      <Navbar
        shadow={desktopMode}
        fullWidth
        className="flex max-w-none h-16 px-6 py-2 space-x-12 bg-background border-0"
      >
        <div className="flex items-center w-3/4 md:w-1/3 space-x-6 justify-start">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-12 w-12 items-center"
          >
            <img src={logo} alt="" />
          </button>
          <CustomNavbarSearchInput
            placeholder="Search RealMate"
            onSearch={handleSearch}
            userResults={foundUsers}
            groupResults={foundGroups}
            onUserResultClick={handleUserResultClick}
            onGroupResultClick={handleGroupResultClick}
          />
        </div>
        <div className="hidden md:flex items-center w-1/3 justify-center space-x-2">
          <Tooltip content="Home" className="bg-tooltip/90">
            <IconButton
              onClick={() => handleTabClick(0)}
              className={`max-w-none max-h-none w-full h-full !shadow-sm ring-1 ring-secondary-1 ${
                activeTab === 0 && "ring ring-primary-1"
              } bg-transparent hover:bg-secondary-4`}
            >
              {activeTab === 0 ? (
                <HomeIconSolid className="h-7 w-7 text-primary-1" />
              ) : (
                <HomeIcon className="h-7 w-7 text-secondary-1" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip content="Chats" className="bg-tooltip/90">
            <IconButton
              onClick={() => handleTabClick(1)}
              className={`max-w-none max-h-none w-full h-full !shadow-sm ring-1 ring-secondary-1 ${
                activeTab === 1 && "ring ring-primary-1"
              } bg-transparent hover:bg-secondary-4`}
            >
              {activeTab === 1 ? (
                <ChatBubbleLeftRightIconSolid className="h-7 w-7 text-primary-1" />
              ) : (
                <ChatBubbleLeftRightIcon className="h-7 w-7 text-secondary-1" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip content="Friends" className="bg-tooltip/90">
            <IconButton
              onClick={() => handleTabClick(2)}
              className={`max-w-none max-h-none w-full h-full !shadow-sm ring-1 ring-secondary-1 ${
                activeTab === 2 && "ring ring-primary-1"
              } bg-transparent hover:bg-secondary-4`}
            >
              {activeTab === 2 ? (
                <UsersIconSolid className="h-7 w-7 text-primary-1" />
              ) : (
                <UsersIcon className="h-7 w-7 text-secondary-1" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip content="Groups" className="bg-tooltip/90">
            <IconButton
              onClick={() => handleTabClick(3)}
              className={`max-w-none max-h-none w-full h-full !shadow-sm ring-1 ring-secondary-1 ${
                activeTab === 3 && "ring ring-primary-1"
              } bg-transparent hover:bg-secondary-4`}
            >
              {activeTab === 3 ? (
                <UserGroupIconSolid className="h-7 w-7 text-primary-1" />
              ) : (
                <UserGroupIcon className="h-7 w-7 text-secondary-1" />
              )}
            </IconButton>
          </Tooltip>
        </div>
        <div className="flex items-center w-1/4 md:w-1/3 justify-end space-x-2">
          <CustomNotificationMenu />
          <CustomProfileMenu />
        </div>
      </Navbar>
      <Navbar
        fullWidth
        className="flex md:hidden max-w-none h-16 px-6 py-2 space-x-12"
      >
        <div className="flex items-center w-full justify-center space-x-2">
          <IconButton
            onClick={() => handleTabClick(0)}
            className={`max-w-none max-h-none w-full h-full !shadow-sm ring-1 ring-secondary-1 ${
              activeTab === 0 && "ring ring-primary-1"
            } bg-transparent hover:bg-secondary-4`}
          >
            {activeTab === 0 ? (
              <HomeIconSolid className="h-7 w-7 text-primary-1" />
            ) : (
              <HomeIcon className="h-7 w-7 text-secondary-1" />
            )}
          </IconButton>
          <IconButton
            onClick={() => handleTabClick(1)}
            className={`max-w-none max-h-none w-full h-full !shadow-sm ring-1 ring-secondary-1 ${
              activeTab === 1 && "ring ring-primary-1"
            } bg-transparent hover:bg-secondary-4`}
          >
            {activeTab === 1 ? (
              <ChatBubbleLeftRightIconSolid className="h-7 w-7 text-primary-1" />
            ) : (
              <ChatBubbleLeftRightIcon className="h-7 w-7 text-secondary-1" />
            )}
          </IconButton>
          <IconButton
            onClick={() => handleTabClick(2)}
            className={`max-w-none max-h-none w-full h-full !shadow-sm ring-1 ring-secondary-1 ${
              activeTab === 2 && "ring ring-primary-1"
            } bg-transparent hover:bg-secondary-4`}
          >
            {activeTab === 2 ? (
              <UsersIconSolid className="h-7 w-7 text-primary-1" />
            ) : (
              <UsersIcon className="h-7 w-7 text-secondary-1" />
            )}
          </IconButton>
          <IconButton
            onClick={() => handleTabClick(3)}
            className={`max-w-none max-h-none w-full h-full !shadow-sm ring-1 ring-secondary-1 ${
              activeTab === 3 && "ring ring-primary-1"
            } bg-transparent hover:bg-secondary-4`}
          >
            {activeTab === 3 ? (
              <UserGroupIconSolid className="h-7 w-7 text-primary-1" />
            ) : (
              <UserGroupIcon className="h-7 w-7 text-secondary-1" />
            )}
          </IconButton>
          <IconButton
            onClick={() => handleTabClick(4)}
            className={`max-w-none max-h-none w-full h-full !shadow-sm ring-1 ring-secondary-1 ${
              activeTab === 4 && "ring ring-primary-1"
            } bg-transparent hover:bg-secondary-4`}
          >
            {activeTab === 4 ? (
              <BellIconSolid className="h-7 w-7 text-primary-1" />
            ) : (
              <BellIcon className="h-7 w-7 text-secondary-1" />
            )}
          </IconButton>
        </div>
      </Navbar>
    </Headroom>
  );
};

export default CustomNavbar;
