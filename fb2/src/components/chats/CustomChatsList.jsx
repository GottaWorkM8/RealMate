import React from "react";
import { List } from "@material-tailwind/react";
import CustomChatsListItem from "./CustomChatsListItem";

const CustomChatsList = ({ chats, activeChatId }) => {
  return (
    <List className="p-0">
      {chats.map(
        ({
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
        }) => {
          return (
            <CustomChatsListItem
              key={id}
              id={id}
              partnerId={partnerId}
              avatarURL={avatarURL}
              displayName={displayName}
              lastActive={lastActive}
              isMuted={isMuted}
              isBlocked={isBlocked}
              partnerLastActive={partnerLastActive}
              partnerIsMuted={partnerIsMuted}
              partnerIsBlocked={partnerIsBlocked}
              creationDate={creationDate}
              lastMessage={lastMessage}
              activeChatId={activeChatId}
            />
          );
        }
      )}
    </List>
  );
};

export default CustomChatsList;
