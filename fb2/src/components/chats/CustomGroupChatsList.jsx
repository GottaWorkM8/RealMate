import React from "react";
import { List } from "@material-tailwind/react";
import CustomGroupChatsListItem from "./CustomGroupChatsListItem";

const CustomGroupChatsList = ({ groupChats, activeChatId }) => {
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
          return (
            <CustomGroupChatsListItem
              key={id}
              id={id}
              avatarURL={avatarURL}
              displayName={displayName}
              joinDate={joinDate}
              lastActive={lastActive}
              isMuted={isMuted}
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

export default CustomGroupChatsList;
