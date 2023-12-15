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
  CardFooter,
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
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// PROFILE MENU ITEMS
const profileMenuItems = [
  {
    id: 0,
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    id: 1,
    label: "Edit Profile",
    icon: PencilSquareIcon,
  },
  {
    id: 2,
    label: "Settings",
    icon: Cog8ToothIcon,
  },
  {
    id: 3,
    label: "Help",
    icon: LifebuoyIcon,
  },
  {
    id: 4,
    label: "Sign Out",
    icon: PowerIcon,
  },
];

const CustomProfileMenu = () => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  const auth = getAuth();

  // USER AUTH STATE OBSERVER
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  // SIGN OUT
  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/login");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  // OPENING AND CLOSING THE MENU
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="wrapper h-full">
      <Menu open={menuOpen} handler={setMenuOpen} placement="bottom-end">
        <Tooltip content="Account" className="bg-tooltip/80">
          <MenuHandler>
            <Button
              variant="text"
              color={menuOpen ? "teal" : "blue-gray"}
              onClick={logout}
              className="flex h-full py-6 items-center space-x-1 rounded-full pl-1 pr-2"
            >
              <Avatar
                alt=""
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                className={`border ${
                  menuOpen ? "border-primary-1" : "border-secondary-1"
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
        <MenuList className="p-2 bg-background">
          <Card className="shadow-none bg-background">
            <CardBody className="p-2">
              <div className="flex items-center gap-4">
                <Avatar
                  alt=""
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                  className="border border-secondary-1"
                />
                <div>
                  <Typography className="text-base font-semibold text-text-1">
                    Jordan Holubecki
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
          {profileMenuItems.map(({ label, icon }, key) => {
            const lastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={closeMenu}
                className={`flex items-center space-x-2 rounded hover:bg-secondary-4 focus:bg-secondary-4 active:bg-secondary-4 ${
                  lastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : ""
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${
                    lastItem ? "text-red-500" : "text-text-1"
                  }`,
                  strokeWidth: 2,
                })}
                <Typography
                  className={`text-sm font-semibold text-text-1 ${
                    lastItem ? "text-red-500" : ""
                  }`}
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
