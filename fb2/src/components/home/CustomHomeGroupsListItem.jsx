import {
  Avatar,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CustomHomeGroupsListItem = ({
  id,
  avatarURL,
  displayName,
  joinDate,
  isFavorite,
}) => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // HANDLING FRIEND CLICK
  const handleGroupClick = (groupId) => {
    navigate(`/profile/group/${groupId}`);
  };

  return (
    <ListItem
      key={id}
      onClick={() => handleGroupClick(id)}
      className="p-1 hover:bg-secondary-4 active:bg-secondary-4 focus:bg-secondary-4"
    >
      <ListItemPrefix>
        <Avatar
          alt=""
          src={avatarURL}
          className="border border-secondary-1 bg-avatar"
        />
      </ListItemPrefix>
      <div className="flex flex-col gap-1">
        <Typography className="text-sm font-semibold text-text-1">
          {displayName}
        </Typography>
      </div>
    </ListItem>
  );
};

export default CustomHomeGroupsListItem;
