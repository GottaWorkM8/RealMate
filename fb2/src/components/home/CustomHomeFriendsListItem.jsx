import {
  Avatar,
  Badge,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomHomeFriendsListItem = ({
  id,
  avatarURL,
  displayName,
  lastActive,
  startDate,
  isClose,
}) => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // HANDLING FRIEND CLICK
  const handleFriendClick = (friendId) => {
    navigate(`/profile/user/${friendId}`);
  };

  // HANDLING USER ACTIVITY
  const [active, setActive] = useState(false);

  const handleActive = () => {
    const date = new Date();
    const timeDiffMils = date.getTime() - lastActive.getTime();
    const timeDiffMins = timeDiffMils / (60 * 1000);
    if (timeDiffMins > 1) setActive(false);
    else setActive(true);
  };

  useEffect(() => {
    if (lastActive) handleActive();
  }, [lastActive]);

  return (
    <ListItem
      key={id}
      onClick={() => handleFriendClick(id)}
      className="p-1 hover:bg-secondary-4 active:bg-secondary-4 focus:bg-secondary-4"
    >
      <ListItemPrefix>
        <Badge
          color="teal"
          withBorder
          className="h-4 w-4 border-background"
          overlap="circular"
          placement="bottom-end"
          invisible={!active}
        >
          <Avatar
            alt=""
            src={avatarURL}
            className="border border-secondary-1 bg-avatar"
          />
        </Badge>
      </ListItemPrefix>
      <div className="flex flex-col gap-1">
        <Typography className="text-sm font-semibold text-text-1">
          {displayName}
        </Typography>
      </div>
    </ListItem>
  );
};

export default CustomHomeFriendsListItem;
