import React, { useEffect, useState } from "react";
import {
  ListItem,
  ListItemPrefix,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { createMsgPreview } from "utils";

const CustomChatsListItem = ({
  id,
  partnerId,
  avatarURL,
  displayName,
  lastActive,
  isMuted,
  isBlocked,
  partnerLastActive,
  partnerIsMuted,
  partnerIsBlocked,
  creationDate,
  lastMessage,
  activeChatId,
}) => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // HANDLING CHAT CLICK
  const handleChatClick = (chatId) => {
    navigate(`/chats/${chatId}`);
  };

  // HANDLING STATES
  const [lastMsgRead, setLastMsgRead] = useState(null);
  const [lastMsgOwned, setLastMsgOwned] = useState(null);
  const [lastMsgPreview, setLastMsgPreview] = useState(null);

  useEffect(() => {
    if (lastMessage) {
      setLastMsgRead(lastActive > lastMessage.sendDate.toDate());
      setLastMsgOwned(lastMessage.sender === currentUser.uid);
      setLastMsgPreview(createMsgPreview(lastMessage.content));
    }
  }, [lastMessage]);

  return (
    <ListItem
      key={id}
      onClick={() => handleChatClick(id)}
      className={`hover:bg-secondary-4 active:bg-secondary-4 ${
        activeChatId === id && "!bg-primary-1/20"
      }`}
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
        {lastMessage && (
          <Typography
            className={`flex text-xs font-normal text-text-3 ${
              !lastMsgRead && "font-medium text-text-1"
            }`}
          >
            <PaperAirplaneIcon
              className={`h-4 w-4 mx-1 ${lastMsgOwned && "rotate-180"}`}
            />
            {lastMsgPreview}
          </Typography>
        )}
      </div>
    </ListItem>
  );
};

export default CustomChatsListItem;
