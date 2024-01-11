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
import logo from "../../assets/icon-circle.png";
import CustomNotificationMenu from "./CustomNotificationMenu";
import { useNavigate, useLocation } from "react-router-dom";
import CustomSearchInput from "components/CustomSearchInput";
import { db } from "../../api/firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

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
    switch (path) {
      case "/":
        setActiveTab(0);
        break;
      case "/chats":
        setActiveTab(1);
        break;
      case "/friends":
        setActiveTab(2);
        break;
      case "/groups":
        setActiveTab(3);
        break;
      case "/notifications":
        setActiveTab(4);
        break;
      default:
        setActiveTab(null);
        break;
    }
  }, [location.pathname]);

  // SEARCHING FOR USERS AND GROUPS
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedGroups, setSearchedGroups] = useState([]);

  const handleSearch = async (term) => {
    const lcTerm = term.toLowerCase();
    if (lcTerm.length > 0) {
      // Search for users by keywords
      const usersQuery = query(
        collection(db, "users"),
        where("keywords", "array-contains", lcTerm),
        limit(3)
      );
      const usersSnapshot = await getDocs(usersQuery);
      const users = usersSnapshot.docs.map((doc) => doc.data());
      setSearchedUsers(users);
      // Search for groups by keywords
      // const groupsQuery = query(
      //   collection(db, "groups"),
      //   where("keywords", "array-contains", lcTerm),
      //   limit(2)
      // );
      // const groupsSnapshot = await getDocs(groupsQuery);
      // const groups = groupsSnapshot.docs.map((doc) => doc.data());
      // setSearchedGroups(groups);
    } else {
      setSearchedUsers([]);
    }
  };

  useEffect(() => {
    console.log("Searched users: " + searchedUsers.length);
    // console.log("Searched groups: " + searchedGroups.length);
  }, [searchedUsers, searchedGroups]);

  return (
    <Headroom pin={desktopMode}>
      <Navbar
        shadow={desktopMode}
        fullWidth
        className="flex max-w-none h-16 px-6 py-2 space-x-12 bg-background"
      >
        <div className="flex items-center w-3/4 md:w-1/3 space-x-6 justify-start">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-full flex-shrink-0 items-center"
          >
            <img className="h-full" src={logo} alt="" />
          </button>
          <CustomSearchInput
            placeholder="Search"
            onSearch={handleSearch}
            results={searchedUsers}
          />
        </div>
        <div className="hidden md:flex items-center w-1/3 justify-center space-x-2">
          <Tooltip content="Home" className="bg-tooltip/80">
            <IconButton
              onClick={() => handleTabClick(0)}
              className={`max-w-none max-h-none w-full h-full !shadow-sm ring-1 ring-secondary-1 ${
                activeTab === 0 ? "ring ring-primary-1" : ""
              } bg-transparent hover:bg-secondary-4`}
            >
              {activeTab === 0 ? (
                <HomeIconSolid className="h-7 w-7 text-primary-1" />
              ) : (
                <HomeIcon className="h-7 w-7 text-secondary-1" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip content="Chats" className="bg-tooltip/80">
            <IconButton
              onClick={() => handleTabClick(1)}
              className={`max-w-none max-h-none w-full h-full !shadow-sm ring-1 ring-secondary-1 ${
                activeTab === 1 ? "ring ring-primary-1" : ""
              } bg-transparent hover:bg-secondary-4`}
            >
              {activeTab === 1 ? (
                <ChatBubbleLeftRightIconSolid className="h-7 w-7 text-primary-1" />
              ) : (
                <ChatBubbleLeftRightIcon className="h-7 w-7 text-secondary-1" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip content="Friends" className="bg-tooltip/80">
            <IconButton
              onClick={() => handleTabClick(2)}
              className={`max-w-none max-h-none w-full h-full !shadow-sm ring-1 ring-secondary-1 ${
                activeTab === 2 ? "ring ring-primary-1" : ""
              } bg-transparent hover:bg-secondary-4`}
            >
              {activeTab === 2 ? (
                <UsersIconSolid className="h-7 w-7 text-primary-1" />
              ) : (
                <UsersIcon className="h-7 w-7 text-secondary-1" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip content="Groups" className="bg-tooltip/80">
            <IconButton
              onClick={() => handleTabClick(3)}
              className={`max-w-none max-h-none w-full h-full !shadow-sm ring-1 ring-secondary-1 ${
                activeTab === 3 ? "ring ring-primary-1" : ""
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
              activeTab === 0 ? "ring ring-primary-1" : ""
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
              activeTab === 1 ? "ring ring-primary-1" : ""
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
              activeTab === 2 ? "ring ring-primary-1" : ""
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
              activeTab === 3 ? "ring ring-primary-1" : ""
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
              activeTab === 4 ? "ring ring-primary-1" : ""
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
