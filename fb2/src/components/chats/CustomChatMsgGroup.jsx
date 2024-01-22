import React, { useEffect, useState } from "react";
import CustomChatMsg from "./CustomChatMsg";
import { Avatar, Tooltip, Typography } from "@material-tailwind/react";
import { formatDate } from "utils";
import { useAuth } from "contexts/AuthContext";

const CustomChatMsgGroup = ({
  messages,
  sender,
  senderAvatarURL,
  senderDisplayName,
  sendDate,
}) => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // HANDLING DATE FORMATTING
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (sendDate) setFormattedDate(formatDate(sendDate));
  }, [sendDate]);

  // HANDLING MESSAGE ALIGNMENT
  const [currentUserSender, setCurrentUserSender] = useState(false);

  useEffect(() => {
    if (sender) setCurrentUserSender(sender === currentUser.uid);
  }, [sender]);

  return (
    <div>
      <Typography className="flex py-2 justify-center text-xs font-normal text-text-3">
        {formattedDate}
      </Typography>
      <div
        className={`flex w-5/6 ${
          currentUserSender && "justify-end ml-auto"
        } items-center gap-2`}
      >
        <Tooltip
          content={senderDisplayName}
          placement="left"
          className="bg-tooltip/90"
        >
          <Avatar
            size="sm"
            alt=""
            src={senderAvatarURL}
            className={`${
              currentUserSender && "hidden"
            } border border-secondary-1 bg-avatar`}
          />
        </Tooltip>
        <div className="flex flex-col rounded-md gap-1 overflow-hidden">
          {messages.map(({ id, sender, content, sendDate }) => {
            return (
              <CustomChatMsg
                key={id}
                id={id}
                sender={sender}
                content={content}
                sendDate={sendDate}
                currentUserSender={currentUserSender}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomChatMsgGroup;
