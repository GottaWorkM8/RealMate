import {
  Menu,
  MenuHandler,
  Button,
  Avatar,
  MenuList,
  MenuItem,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  LifebuoyIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";

// PROFILE MENU COMPONENTS
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Edit Profile",
    icon: PencilSquareIcon,
  },
  {
    label: "Settings",
    icon: Cog8ToothIcon,
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

const CustomProfileMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="wrapper h-full">
      <Menu open={menuOpen} handler={setMenuOpen} placement="bottom-end">
        <Tooltip content="Home" className="bg-text1 bg-opacity-80">
          <MenuHandler>
            <Button
              variant="text"
              color={menuOpen ? "teal" : "blue-gray"}
              className="flex h-full py-6 items-center space-x-1 rounded-full pl-1 pr-2"
            >
              <Avatar
                alt=""
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                className={`border ${
                  menuOpen ? "border-primary1" : "border-secondary1"
                }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`h-3 w-3 transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </MenuHandler>
        </Tooltip>
        <MenuList className="p-2">
          {profileMenuItems.map(({ label, icon }, key) => {
            const lastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={closeMenu}
                className={`flex items-center space-x-2 rounded ${
                  lastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : ""
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${lastItem ? "text-red-500" : ""}`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color={lastItem ? "red" : "inherit"}
                >
                  {label}
                </Typography>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </div>
  );
};

export default CustomProfileMenu;
