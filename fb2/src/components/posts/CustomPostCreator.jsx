import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";

const menuItems = [
  {
    id: 0,
    label: "Image",
    path: "",
    icon: HomeIcon,
  },
  {
    id: 1,
    label: "Video",
    path: "requests",
    icon: UserPlusIcon,
  },
  {
    id: 2,
    label: "Tag Friends",
    path: "friends",
    icon: UsersIcon,
  },
  {
    id: 3,
    label: "Close Friends",
    path: "close-friends",
    icon: FireIcon,
  },
];

const CustomPostCreator = () => {
  return (
    <List>
      {friendsMenuItems.map(({ id, label, icon }) => {
        return (
          <ListItem
            key={id}
            onClick={() => handleCategoryClick(id)}
            className={`hover:bg-secondary-4 active:bg-secondary-4 ${
              activeCategoryId === id && "!bg-primary-1/20"
            }`}
          >
            <ListItemPrefix>
              {React.createElement(icon, {
                className: "h-7 w-7 text-text-1",
                strokeWidth: 2,
              })}
            </ListItemPrefix>
            <Typography className="text-sm font-semibold text-text-1">
              {label}
            </Typography>
          </ListItem>
        );
      })}
    </List>
  );
};

export default CustomPostCreator;
