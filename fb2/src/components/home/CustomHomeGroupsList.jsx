import { List } from "@material-tailwind/react";
import React from "react";
import CustomHomeGroupsListItem from "./CustomHomeGroupsListItem";

const CustomHomeGroupsList = ({ groups }) => {
  const normalGroups = groups.filter((group) => !group.isFavorite);
  const favoriteGroups = groups.filter((group) => group.isFavorite);

  return (
    <div className="flex flex-col gap-2">
      {favoriteGroups.length > 0 && (
        <>
          <h2 className="text-sm text-text-2 font-semibold">Favorite groups</h2>
          <List className="p-0">
            {favoriteGroups.map(
              ({ id, avatarURL, displayName, joinDate, isFavorite }) => (
                <CustomHomeGroupsListItem
                  key={id}
                  id={id}
                  avatarURL={avatarURL}
                  displayName={displayName}
                  joinDate={joinDate}
                  isFavorite={isFavorite}
                />
              )
            )}
          </List>
        </>
      )}
      {normalGroups.length > 0 && (
        <>
          <h2 className="text-sm text-text-2 font-semibold">Groups</h2>
          <List className="p-0">
            {normalGroups.map(
              ({ id, avatarURL, displayName, joinDate, isFavorite }) => (
                <CustomHomeGroupsListItem
                  key={id}
                  id={id}
                  avatarURL={avatarURL}
                  displayName={displayName}
                  joinDate={joinDate}
                  isFavorite={isFavorite}
                />
              )
            )}
          </List>
        </>
      )}
    </div>
  );
};

export default CustomHomeGroupsList;
