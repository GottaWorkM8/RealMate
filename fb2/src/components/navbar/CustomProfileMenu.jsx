import {
  Menu,
  MenuHandler,
  Button,
  Avatar,
  MenuList,
  MenuItem,
  Typography,
  Tooltip,
  Card,
  CardBody,
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
              variant="text"
              color={menuOpen ? "teal" : "blue-gray"}
              className="flex h-full py-6 items-center space-x-1 rounded-full pl-1 pr-2"
            >
              <Avatar
                alt=""
                src={currentUser.photoURL}
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
          <Card className="shadow-none bg-background">
            <CardBody className="flex items-center p-2 gap-4">
              <Avatar
                alt=""
                src={currentUser.photoURL}
                className="border border-secondary-1 bg-avatar"
              />
              <Typography className="text-base font-semibold text-text-2">
                {currentUser.displayName}
              </Typography>
            </CardBody>
          </Card>
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
