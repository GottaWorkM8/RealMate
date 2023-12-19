// IMPORTS
import React, { useState, useEffect } from "react";
import { IconButton, Input, Navbar, Tooltip } from "@material-tailwind/react";
import CustomProfileMenu from "./CustomProfileMenu";
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
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
          <Input
            type="text"
            placeholder="Search"
            maxLength={50}
            color="teal"
            className="text-text-1 !border-secondary-2 placeholder:text-text-4 focus:!border-primary-1"
            labelProps={{
              className: "hidden",
            }}
            containerProps={{
              className: "min-w-[6rem] max-w-[15rem] bg-secondary-4 rounded-lg",
            }}
            icon={<MagnifyingGlassIcon />}
            crossOrigin={undefined}
          />
        </div>
        <div className="hidden md:flex items-center w-1/3 justify-center space-x-2">
          <Tooltip content="Home" className="bg-tooltip/80">
            <IconButton
              variant="outlined"
              color={activeTab === 0 ? "teal" : "blue-gray"}
              onClick={() => handleTabClick(0)}
              className={`bg-transparent hover:bg-secondary-4 ring-0 focus:ring-0 ${
                activeTab === 0 ? "ring focus:ring ring-primary-2" : ""
              } max-w-none max-h-none w-full h-full`}
            >
              {activeTab === 0 ? (
                <HomeIconSolid className="h-7 w-7" />
              ) : (
                <HomeIcon className="h-7 w-7" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip content="Chats" className="bg-tooltip/80">
            <IconButton
              variant="outlined"
              color={activeTab === 1 ? "teal" : "blue-gray"}
              onClick={() => handleTabClick(1)}
              className={`bg-transparent hover:bg-secondary-4 ring-0 focus:ring-0 ${
                activeTab === 1 ? "ring focus:ring ring-primary-2" : ""
              } max-w-none max-h-none w-full h-full`}
            >
              {activeTab === 1 ? (
                <ChatBubbleLeftRightIconSolid className="h-7 w-7" />
              ) : (
                <ChatBubbleLeftRightIcon className="h-7 w-7" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip content="Friends" className="bg-tooltip/80">
            <IconButton
              variant="outlined"
              color={activeTab === 2 ? "teal" : "blue-gray"}
              onClick={() => handleTabClick(2)}
              className={`bg-transparent hover:bg-secondary-4 ring-0 focus:ring-0 ${
                activeTab === 2 ? "ring focus:ring ring-primary-2" : ""
              } max-w-none max-h-none w-full h-full`}
            >
              {activeTab === 2 ? (
                <UsersIconSolid className="h-7 w-7" />
              ) : (
                <UsersIcon className="h-7 w-7" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip content="Groups" className="bg-tooltip/80">
            <IconButton
              variant="outlined"
              color={activeTab === 3 ? "teal" : "blue-gray"}
              onClick={() => handleTabClick(3)}
              className={`bg-transparent hover:bg-secondary-4 ring-0 focus:ring-0 ${
                activeTab === 3 ? "ring focus:ring ring-primary-2" : ""
              } max-w-none max-h-none w-full h-full`}
            >
              {activeTab === 3 ? (
                <UserGroupIconSolid className="h-7 w-7" />
              ) : (
                <UserGroupIcon className="h-7 w-7" />
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
            variant="outlined"
            color={activeTab === 0 ? "teal" : "blue-gray"}
            onClick={() => handleTabClick(0)}
            className={`bg-transparent hover:bg-secondary-4 ring-0 focus:ring-0 ${
              activeTab === 0 ? "ring focus:ring ring-primary-2" : ""
            } max-w-none max-h-none w-full h-full`}
          >
            {activeTab === 0 ? (
              <HomeIconSolid className="h-7 w-7" />
            ) : (
              <HomeIcon className="h-7 w-7" />
            )}
          </IconButton>
          <IconButton
            variant="outlined"
            color={activeTab === 1 ? "teal" : "blue-gray"}
            onClick={() => handleTabClick(1)}
            className={`bg-transparent hover:bg-secondary-4 ring-0 focus:ring-0 ${
              activeTab === 1 ? "ring focus:ring ring-primary-2" : ""
            } max-w-none max-h-none w-full h-full`}
          >
            {activeTab === 1 ? (
              <ChatBubbleLeftRightIconSolid className="h-7 w-7" />
            ) : (
              <ChatBubbleLeftRightIcon className="h-7 w-7" />
            )}
          </IconButton>
          <IconButton
            variant="outlined"
            color={activeTab === 2 ? "teal" : "blue-gray"}
            onClick={() => handleTabClick(2)}
            className={`bg-transparent hover:bg-secondary-4 ring-0 focus:ring-0 ${
              activeTab === 2 ? "ring focus:ring ring-primary-2" : ""
            } max-w-none max-h-none w-full h-full`}
          >
            {activeTab === 2 ? (
              <UsersIconSolid className="h-7 w-7" />
            ) : (
              <UsersIcon className="h-7 w-7" />
            )}
          </IconButton>
          <IconButton
            variant="outlined"
            color={activeTab === 3 ? "teal" : "blue-gray"}
            onClick={() => handleTabClick(3)}
            className={`bg-transparent hover:bg-secondary-4 ring-0 focus:ring-0 ${
              activeTab === 3 ? "ring focus:ring ring-primary-2" : ""
            } max-w-none max-h-none w-full h-full`}
          >
            {activeTab === 3 ? (
              <UserGroupIconSolid className="h-7 w-7" />
            ) : (
              <UserGroupIcon className="h-7 w-7" />
            )}
          </IconButton>
          <IconButton
            variant="outlined"
            color={activeTab === 4 ? "teal" : "blue-gray"}
            onClick={() => handleTabClick(4)}
            className={`bg-transparent hover:bg-secondary-4 ring-0 focus:ring-0 ${
              activeTab === 4 ? "ring focus:ring ring-primary-2" : ""
            } max-w-none max-h-none w-full h-full`}
          >
            {activeTab === 4 ? (
              <BellIconSolid className="h-7 w-7" />
            ) : (
              <BellIcon className="h-7 w-7" />
            )}
          </IconButton>
        </div>
      </Navbar>
    </Headroom>
  );
};

export default CustomNavbar;
