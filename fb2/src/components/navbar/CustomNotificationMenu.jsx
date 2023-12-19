import { BellIcon, ClockIcon } from "@heroicons/react/24/solid";
import {
  Menu,
  MenuHandler,
  MenuList,
  IconButton,
  Badge,
  Tooltip,
  MenuItem,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// NOTIFICATION MENU ITEMS
const notificationMenuItems = [
  {
    id: 0,
    msg: "Tania sent you a message.",
    read: false,
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    time: "just now",
  },
  {
    id: 1,
    msg: "Natalie replied to your email.",
    read: true,
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80",
    time: "13 minutes ago",
  },
  {
    id: 2,
    msg: "You've received a payment.",
    read: true,
    avatar:
      "https://dwglogo.com/wp-content/uploads/2016/08/PayPal_Logo_Icon.png",
    time: "5 hours ago",
  },
];

const CustomNotificationMenu = () => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(null);
  const closeMenu = () => setMenuOpen(false);

  const handleMsgClick = (msgId) => {
    const itemId = notificationMenuItems.findIndex((item) => item.id === msgId);
    if (itemId !== -1 && !notificationMenuItems[itemId].read) {
      notificationMenuItems.at(itemId).read = true;
    }
  };

  return (
    <div className="wrapper hidden md:flex h-full">
      <Menu open={menuOpen} handler={setMenuOpen} placement="bottom">
        <Badge content="5" withBorder className="m-1.5">
          <Tooltip content="Notifications" className="bg-tooltip/80">
            <MenuHandler>
              <IconButton
                size="lg"
                className={`rounded-full ${
                  menuOpen
                    ? "bg-primary-1/20 hover:bg-primary-1/30 text-primary-1"
                    : "bg-secondary-1/40 hover:bg-secondary-1/60 text-text-2"
                }`}
              >
                <BellIcon className="h-7 w-7" />
              </IconButton>
            </MenuHandler>
          </Tooltip>
        </Badge>
        <MenuList className="p-2 bg-background">
          {notificationMenuItems.map(({ id, msg, read, avatar, time }) => {
            return (
              <MenuItem
                key={id}
                onClick={() => handleMsgClick(id)}
                className="flex items-center gap-4 py-2 pl-2 pr-8 hover:bg-secondary-4 focus:bg-secondary-4 active:bg-secondary-4"
              >
                <Avatar
                  alt=""
                  src={avatar}
                  className="border border-secondary-1 bg-avatar"
                />
                <div className="flex flex-col gap-1">
                  <Typography
                    className={`text-sm font-semibold text-text-1 ${
                      read ? "font-normal text-text-3" : ""
                    }`}
                  >
                    {msg}
                  </Typography>
                  <Typography
                    className={`flex items-center gap-1 text-xs font-medium text-primary-1 ${
                      read ? "font-normal text-text-3" : ""
                    }`}
                  >
                    <ClockIcon className="h-4 w-4" />
                    {time}
                  </Typography>
                </div>
              </MenuItem>
            );
          })}
          <div className="text-center w-full">
            <button
              type="button"
              onClick={() => navigate("/notifications")}
              className="w-full p-3 rounded-md hover:bg-secondary-4 text-base font-semibold text-primary-1"
            >
              Show all notifications
            </button>
          </div>
        </MenuList>
      </Menu>
    </div>
  );
};

export default CustomNotificationMenu;
