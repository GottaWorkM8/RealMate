import { List } from "@material-tailwind/react";
import React from "react";
import CustomHomeFriendsListItem from "./CustomHomeFriendsListItem";

const CustomHomeFriendsList = ({ friends }) => {
  const distantFriends = friends.filter((friend) => !friend.isClose);
  const closeFriends = friends.filter((friend) => friend.isClose);

  return (
    <div className="flex flex-col gap-2">
      {closeFriends.length > 0 && (
        <>
          <h2 className="text-sm text-text-2 font-semibold">Close friends</h2>
          <List className="p-0">
            {closeFriends.map(
              ({
                id,
                avatarURL,
                displayName,
                lastActive,
                startDate,
                isClose,
              }) => (
                <CustomHomeFriendsListItem
                  key={id}
                  id={id}
                  avatarURL={avatarURL}
                  displayName={displayName}
                  lastActive={lastActive}
                  startDate={startDate}
                  isClose={isClose}
                />
              )
            )}
          </List>
        </>
      )}
      {distantFriends.length > 0 && (
        <>
          <h2 className="text-sm text-text-2 font-semibold">Friends</h2>
          <List className="p-0">
            {distantFriends.map(
              ({ id, avatarURL, displayName, startDate, isClose }) => (
                <CustomHomeFriendsListItem
                  key={id}
                  id={id}
                  avatarURL={avatarURL}
                  displayName={displayName}
                  startDate={startDate}
                  isClose={isClose}
                />
              )
            )}
          </List>
        </>
      )}
    </div>
  );
};

export default CustomHomeFriendsList;
