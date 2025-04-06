import { MinusCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";

const CustomMembersListItem = ({
  id,
  displayName,
  avatarURL,
  onMemberClick,
}) => {
  // HANDLING HOVERING
  const [isHovered, setIsHovered] = useState(false);

  // HANDLING MEMBER CLICK
  const handleMemberClick = (userId) => {
    onMemberClick(userId);
  };

  return (
    <ListItem
      key={id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      {isHovered && (
        <ListItemSuffix>
          <IconButton
            onClick={() => handleMemberClick(id)}
            className="rounded-full bg-transparent hover:bg-secondary-1/40 text-text-2"
          >
            <MinusCircleIcon className="h-6 w-6" />
          </IconButton>
        </ListItemSuffix>
      )}
    </ListItem>
  );
};

export default CustomMembersListItem;
