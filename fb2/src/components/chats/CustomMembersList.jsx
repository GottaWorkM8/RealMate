import React from "react";
import { List } from "@material-tailwind/react";
import CustomMembersListItem from "./CustomMembersListItem";

const CustomMembersList = ({ members, onMemberClick }) => {
  return (
    <List className="p-0">
      {members.map(({ id, avatarURL, displayName }) => {
        return (
          <CustomMembersListItem
            key={id}
            id={id}
            avatarURL={avatarURL}
            displayName={displayName}
            onMemberClick={onMemberClick}
          />
        );
      })}
    </List>
  );
};

export default CustomMembersList;
