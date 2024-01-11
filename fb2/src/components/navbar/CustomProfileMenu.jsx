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
import { useAuth } from "contexts/AuthContext";

const CustomProfileMenu = () => {
  // CURRENT USER
  const { currentUser } = useAuth();
  const avatarURL = currentUser.photoURL;
  const displayName = currentUser.displayName;

  // OPENING AND CLOSING THE MENU
  const [menuOpen, setMenuOpen] = useState(false);

  // SIGN OUT
  const { logout } = useAuth();
  const handleLogout = async (e) => {
    try {
      logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="wrapper h-full">
      <Menu open={menuOpen} handler={setMenuOpen} placement="bottom-end">
        <Tooltip content="Account" className="bg-tooltip/80">
          <MenuHandler>
            <Button
              className={`flex h-full py-6 pl-0 pr-2 items-center space-x-1 rounded-full ${
                menuOpen
                  ? "bg-primary-1/20 hover:bg-primary-1/30 text-primary-1"
                  : "bg-secondary-1/40 hover:bg-secondary-1/60 text-text-2"
              }`}
            >
              <Avatar
                alt=""
                src={avatarURL}
                className={`border ${
                  menuOpen ? "border-primary-1" : "border-secondary-1"
                } bg-avatar`}
              />
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </MenuHandler>
        </Tooltip>
        <MenuList className="p-2 bg-background">
          <MenuItem className="flex items-center p-3 gap-3 rounded shadow-none pointer-events-none">
            <Avatar
              alt=""
              src={avatarURL}
              className="border border-secondary-1 bg-avatar"
            />
            <Typography className="text-base font-semibold text-text-1">
              {displayName}
            </Typography>
          </MenuItem>
          <MenuItem className="flex items-center gap-3 rounded hover:bg-secondary-4 focus:bg-secondary-4 active:bg-secondary-4">
            <UserCircleIcon className="h-4 w-4 text-text-1" />
            <Typography className="text-sm font-semibold text-text-1">
              My Profile
            </Typography>
          </MenuItem>
          <MenuItem className="flex items-center gap-3 rounded hover:bg-secondary-4 focus:bg-secondary-4 active:bg-secondary-4">
            <PencilSquareIcon className="h-4 w-4 text-text-1" />
            <Typography className="text-sm font-semibold text-text-1">
              Edit Profile
            </Typography>
          </MenuItem>
          <MenuItem className="flex items-center gap-3 rounded hover:bg-secondary-4 focus:bg-secondary-4 active:bg-secondary-4">
            <Cog8ToothIcon className="h-4 w-4 text-text-1" />
            <Typography className="text-sm font-semibold text-text-1">
              Settings
            </Typography>
          </MenuItem>
          <MenuItem className="flex items-center gap-3 rounded hover:bg-secondary-4 focus:bg-secondary-4 active:bg-secondary-4">
            <LifebuoyIcon className="h-4 w-4 text-text-1" />
            <Typography className="text-sm font-semibold text-text-1">
              Help
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            className="flex items-center gap-3 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
          >
            <PowerIcon className="h-4 w-4 text-red-500" />
            <Typography className="text-sm font-semibold text-red-500">
              Sign out
            </Typography>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export default CustomProfileMenu;
