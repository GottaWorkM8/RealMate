import {
  Avatar,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CustomHomeChatsListItem = ({
  id,
  partnerId,
  avatarURL,
  displayName,
  partnerLastActive,
}) => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // HANDLING FRIEND CLICK
  const handleChatClick = (chatId) => {
    navigate(`/chats/${chatId}`);
  };

  return (
    <ListItem
      key={id}
      onClick={() => handleChatClick(id)}
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

export default CustomHomeChatsListItem;
