import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { PlusIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/solid";
import { Badge, Typography } from "@material-tailwind/react";
import CustomButton from "components/buttons/CustomButton";
import React from "react";

const CustomGroupProfileTop = ({
  groupId,
  avatarURL,
  backgroundURL,
  displayName,
  description,
  memberCount,
  isPublic,
  isSafeForWork,
  isMember,
  isFavorite,
  isInviteSent,
  isInviteReceived,
}) => {
  return (
    <div className="relative mb-4">
      <img
        alt=""
        src={backgroundURL}
        className="rounded-b-md object-cover object-center"
      />
      <div className="py-6 px-9">
        <div className="absolute bottom-0">
          <Badge
            color="teal"
            withBorder
            className="h-8 w-8 border-background"
            overlap="circular"
            placement="bottom-end"
          >
            <img
              alt=""
              src={avatarURL}
              className="h-[200px] w-[200px] rounded-full object-cover object-center border-4 border-background bg-avatar"
            />
          </Badge>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col pl-[13.5rem] gap-2">
            <Typography className="text-4xl font-bold text-text-1">
              {displayName}
            </Typography>
            <Typography className="flex gap-3 text-sm font-semibold text-text-3">
              <div className="flex gap-1 items-center">
                <GlobeAltIcon className="h-4 w-4" />
                {isPublic ? "Public group" : "Private group"}
              </div>
              <div className="flex gap-1 items-center">
                <UserGroupIcon className="h-4 w-4" />
                {memberCount + " members"}
              </div>
            </Typography>
          </div>
          <div className="flex gap-2 items-center">
            <CustomButton
              icon={<UserIcon className="h-5 w-5" />}
              text={"Member"}
              colored={false}
            />
            <CustomButton
              icon={<PlusIcon className="h-5 w-5" />}
              text={"Invite"}
              colored={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomGroupProfileTop;
