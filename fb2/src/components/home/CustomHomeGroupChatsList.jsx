import { List } from "@material-tailwind/react";
import React from "react";
import CustomHomeGroupChatsListItem from "./CustomHomeGroupChatsListItem";

const CustomHomeGroupChatsList = ({ chats }) => {
  return (
    <List className="p-0">
      {chats.map(({ id, avatarURL, displayName }) => (
        <CustomHomeGroupChatsListItem
          key={id}
          id={id}
          avatarURL={avatarURL}
          displayName={displayName}
        />
      ))}
    </List>
  );
};

export default CustomHomeGroupChatsList;
