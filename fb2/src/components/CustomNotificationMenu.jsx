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

// PROFILE MENU COMPONENTS
const notificationMenuItems = [
  {
    id: 1,
    msg: "Tania sent you a message.",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    time: "just now",
  },
  {
    id: 2,
    msg: "Natalie replied to your email.",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80",
    time: "13 minutes ago",
  },
  {
    id: 3,
    msg: "You've received a payment.",
    avatar:
      "https://dwglogo.com/wp-content/uploads/2016/08/PayPal_Logo_Icon.png",
    time: "5 hours ago",
  },
];

const CustomNotificationMenu = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const closeMenu = () => setMenuOpen(false);

  const [msgRead, setMsgRead] = useState(null);

  const handleMsgClick = (msgId) => {
    switch (msgId) {
      case 1:
        setMsgRead(!msgRead);
        break;
      case 2:
        setMsgRead(!msgRead);
        break;
      case 3:
        setMsgRead(!msgRead);
        break;
      default:
        break;
    }
  };

  return (
    <div className="wrapper hidden md:flex h-full">
      <Menu open={menuOpen} handler={setMenuOpen} placement="bottom">
        <Badge content="5" withBorder className="m-1.5">
          <Tooltip content="Notifications" className="bg-text1 bg-opacity-80">
            <MenuHandler>
              <IconButton
                size="lg"
                className={`rounded-full ${
                  menuOpen
                    ? "bg-primary4 hover:bg-primary3"
                    : "bg-secondary2 hover:bg-text5"
                }`}
              >
                <BellIcon
                  className={`h-7 w-7 ${
                    menuOpen ? "text-primary1" : "text-text2"
                  }`}
                />
              </IconButton>
            </MenuHandler>
          </Tooltip>
        </Badge>
        <MenuList className="p-2">
          {notificationMenuItems.map(({ id, msg, avatar, time }) => {
            return (
              <MenuItem
                key={msg}
                onClick={() => {
                  handleMsgClick(id);
                  closeMenu();
                }}
                className="flex items-center gap-4 py-2 pl-2 pr-8"
              >
                <Avatar alt="" src={avatar} />
                <div className="flex flex-col gap-1">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-semibold text-text2 ${
                      msgRead ? "text-text4" : ""
                    }`}
                  >
                    {msg}
                  </Typography>
                  <Typography
                    className={`flex items-center gap-1 text-xs font-medium text-primary1 ${
                      msgRead ? "font-light text-text3" : ""
                    }`}
                  >
                    <ClockIcon className="h-4 w-4" />
                    {time}
                  </Typography>
                </div>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </div>
  );
};

export default CustomNotificationMenu;
