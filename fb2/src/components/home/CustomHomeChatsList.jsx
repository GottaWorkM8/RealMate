import { List } from "@material-tailwind/react";
import React from "react";
import CustomHomeChatsListItem from "./CustomHomeChatsListItem";

const CustomHomeChatsList = ({ chats }) => {
  return (
    <List className="p-0">
      {chats.map(
        ({ id, partnerId, avatarURL, displayName, partnerLastActive }) => (
          <CustomHomeChatsListItem
            key={id}
            id={id}
            partnerId={partnerId}
            avatarURL={avatarURL}
            displayName={displayName}
            partnerLastActive={partnerLastActive}
          />
        )
      )}
    </List>
  );
};

export default CustomHomeChatsList;
