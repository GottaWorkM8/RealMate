import {
  HomeIcon,
  StarIcon,
  UserPlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import {
  List,
  ListItem,
  ListItemPrefix,
  Card,
  Typography,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// GROUPS MENU ITEMS
const groupsMenuItems = [
  {
    id: 0,
    label: "Home",
    path: "",
    icon: HomeIcon,
  },
  {
    id: 1,
    label: "Group Invites",
    path: "invites",
    icon: UserPlusIcon,
  },
  {
    id: 2,
    label: "Groups",
    path: "groups",
    icon: UserGroupIcon,
  },
  {
    id: 3,
    label: "Favorite Groups",
    path: "favorite-groups",
    icon: StarIcon,
  },
];

const CustomGroupsMenu = () => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  // HANDLING CATEGORIES
  const [activeCategory, setActiveCategory] = useState(null);

  const isCategoryActive = (categoryId) => {
    return activeCategory === categoryId;
  };

  const handleCategoryClick = (categoryId) => {
    if (categoryId === 0) navigate("/groups");
    else {
      const matchedCategory = groupsMenuItems.find(
        (item) => item.id === categoryId
      );
      if (matchedCategory) navigate(`/groups/${matchedCategory.path}`);
    }
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === "/groups") setActiveCategory(0);
    else {
      const match = path.match(/^\/groups\/([^/]+)$/);
      if (match) {
        const category = match[1];
        const matchedCategory = groupsMenuItems.find(
          (item) => item.path === category
        );

        if (matchedCategory) setActiveCategory(matchedCategory.id);
        else setActiveCategory(null);
      } else setActiveCategory(null);
    }
  }, [location.pathname]);

  return (
    <List>
      {groupsMenuItems.map(({ id, label, icon }) => {
        return (
          <ListItem
            key={id}
            onClick={() => handleCategoryClick(id)}
            selected={isCategoryActive(id)}
            className={`hover:bg-secondary-4 active:bg-secondary-4 ${
              activeCategory === id && "!bg-primary-1/20"
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

export default CustomGroupsMenu;
