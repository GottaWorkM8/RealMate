import React from "react";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { createMsgPreview } from "utils";

const CustomGroupChatsList = ({ groupChats, activeChatId }) => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // HANDLING CHAT CLICK
  const handleChatClick = (chatId) => {
    navigate(`/chats/${chatId}`);
  };

  return (
    <List className="p-0">
      {groupChats.map(
        ({
          id,
          avatarURL,
          displayName,
          joinDate,
          lastActive,
          isMuted,
          creationDate,
          lastMessage,
        }) => {
          const lastMsgRead = lastActive > lastMessage.sendDate.toDate();
          const lastMsgYours = lastMessage.sender === currentUser.uid;
          const lastMsgPreview = createMsgPreview(lastMessage.content);
          return (
            <ListItem
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
              <div className="gap-1">
                <Typography className="text-sm font-semibold text-text-1">
                  {displayName}
                </Typography>
                <Typography
                  className={`flex text-xs font-normal text-text-3 ${
                    !lastMsgRead && "font-medium text-text-1"
                  }`}
                >
                  <PaperAirplaneIcon
                    className={`h-4 w-4 mx-1 ${
                      lastMsgYours && "rotate-180"
                    }`}
                  />
                  {lastMsgPreview}
                </Typography>
              </div>
            </ListItem>
          );
        }
      )}
    </List>
  );
};

export default CustomGroupChatsList;
