import React from "react";
import CustomChatMsg from "./CustomChatMsg";
import { Avatar, Typography } from "@material-tailwind/react";

const CustomChatMsgGroup = ({ msgGroup }) => {
  const sendDayTime = msgGroup[0].sendDate.toString();

  return (
    <div>
      <Typography className="text-xs font-light text-text-2">
        {sendDayTime}
      </Typography>
      <div className="">
        {msgGroup.map(({ content }) => {
          return <CustomChatMsg msg={content} />;
        })}
        <div>
          {msgGroup.senderAvatarURL && (
            <Avatar
              size="sm"
              alt=""
              src={msgGroup.senderAvatarURL}
              className="border border-secondary-1 bg-avatar"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomChatMsgGroup;
