import {
  HomeIcon,
  FireIcon,
  UserPlusIcon,
  UsersIcon,
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

// FRIENDS MENU ITEMS
const friendsMenuItems = [
  {
    id: 0,
    label: "Home",
    path: "",
    icon: HomeIcon,
  },
  {
    id: 1,
    label: "Friend Requests",
    path: "requests",
    icon: UserPlusIcon,
  },
  {
    id: 2,
    label: "Friends",
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

const CustomFriendsMenu = () => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  // HANDLING CATEGORIES
  const [activeCategory, setActiveCategory] = useState(null);

  const isCategoryActive = (categoryId) => {
    return activeCategory === categoryId;
  };

  const handleCategoryClick = (categoryId) => {
    if (categoryId === 0) navigate("/friends");
    else {
      const matchedCategory = friendsMenuItems.find(
        (item) => item.id === categoryId
      );
      navigate(`/friends/${matchedCategory.path}`);
    }
  };

  useEffect(() => {
    const path = location.pathname;

    if (path === "/friends") {
      setActiveCategory(0);
    } else {
      const match = path.match(/^\/friends\/([^/]+)$/);

      if (match) {
        const category = match[1];
        const matchedCategory = friendsMenuItems.find(
          (item) => item.path === category
        );

        if (matchedCategory) {
          setActiveCategory(matchedCategory.id);
        } else {
          setActiveCategory(null);
        }
      } else {
        setActiveCategory(null);
      }
    }
  }, [location.pathname]);

  return (
    <Card className="shadow-none rounded-none bg-background">
      <List>
        {friendsMenuItems.map(({ id, label, icon }) => {
          return (
            <ListItem
              key={id}
              onClick={() => handleCategoryClick(id)}
              selected={isCategoryActive(id)}
              className={`hover:bg-secondary-4 active:bg-secondary-4 ${
                activeCategory === id ? "!bg-primary-1/20" : ""
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
    </Card>
  );
};

export default CustomFriendsMenu;
