import React from "react";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const CustomGroupChatsList = ({ groupChatsList, activeChatId }) => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // HANDLING CHAT CLICK
  const handleChatClick = (chatId) => {
    navigate(`/chats/${chatId}`);
  };

  return (
    <Card className="shadow-none rounded-none bg-background">
      <List>
        {groupChatsList.map(
          ({
            id,
            docRef,
            avatarURL,
            displayName,
            members,
            userIndex,
            creationDate,
            lastMsg,
          }) => {
            const lastMsgRead =
              members[userIndex].lastActive > lastMsg.sendDate;
            const lastMsgYours = lastMsg.senderId === currentUser.uid;
            const lastMsgPreview =
              lastMsg.content.length > 30
                ? lastMsg.content.slice(0, 30) + " ..."
                : lastMsg.content;
            return (
              <ListItem
                onClick={() => handleChatClick(id)}
                className={`hover:bg-secondary-4 active:bg-secondary-4 ${
                  activeChatId === id ? "!bg-primary-1/20" : ""
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
                      lastMsgRead ? "" : "font-medium text-text-1"
                    }`}
                  >
                    <PaperAirplaneIcon
                      className={`h-4 w-4 mx-1 ${
                        lastMsgYours ? "rotate-180" : ""
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
    </Card>
  );
};

export default CustomGroupChatsList;
