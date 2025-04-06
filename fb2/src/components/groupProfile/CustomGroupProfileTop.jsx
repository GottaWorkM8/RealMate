import { GlobeAltIcon } from "@heroicons/react/24/outline";
import {
  CameraIcon,
  CheckIcon,
  EllipsisHorizontalIcon,
  PhotoIcon,
  StarIcon,
  UserGroupIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";
import {
  deleteUserGroup,
  deleteUserGroupInvite,
  setUserGroup,
  setUserGroupInvite,
  updateGroupBackgroundImage,
  updateGroupProfileImage,
  updateUserBackgroundImage,
  updateUserGroupIsFavorite,
  updateUserProfileImage,
} from "apis/firebase";
import CustomButton from "components/buttons/CustomButton";
import { useAuth } from "contexts/AuthContext";
import React, { useRef, useState } from "react";
import { compressBackgroundImage, compressProfileImage } from "utils";

const CustomGroupProfileTop = ({
  groupId,
  avatarURL,
  backgroundURL,
  displayName,
  description,
  memberCount,
  isPublic,
  isSafeForWork,
  isAdmin,
  isMember,
  joinDate,
  isFavorite,
  isInviteSent,
  isInviteReceived,
}) => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // UPLOADING NEW PROFILE IMAGE
  const [changedProfile, setChangedProfile] = useState(null);

  const profileInputRef = useRef(null);

  const handleProfileClick = () => {
    profileInputRef.current.click();
  };
  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressedFile = await compressProfileImage(file);
    updateGroupProfileImage(groupId, compressedFile);
    setChangedProfile(compressedFile);
    e.target.value = null;
    console.log("Profile uploaded:", file.name);
  };

  // UPLOADING NEW BACKGROUND IMAGE
  const [changedBackground, setChangedBackground] = useState(null);

  const backgroundInputRef = useRef(null);

  const handleBackgroundClick = () => {
    backgroundInputRef.current.click();
  };
  const handleBackgroundChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressedFile = await compressBackgroundImage(file);
    updateGroupBackgroundImage(groupId, compressedFile);
    setChangedBackground(compressedFile);
    e.target.value = null;
    console.log("Background uploaded:", file.name);
  };

  // STATES
  const [count, setCount] = useState(memberCount);
  const [favoriteGroup, setFavoriteGroup] = useState(isFavorite);
  const [currentMember, setCurrentMember] = useState(isMember);
  const [groupInvited, setGroupInvited] = useState(isInviteSent);
  const [currentUserInvited, setCurrentUserInvited] =
    useState(isInviteReceived);

  // HANDLE BUTTON CLICKS
  const handleFavoriteButtonGroupClick = () => {
    updateUserGroupIsFavorite(currentUser.uid, groupId, true);
    setFavoriteGroup(true);
  };
  const handleFavoriteButtonFavoriteClick = () => {
    updateUserGroupIsFavorite(currentUser.uid, groupId, false);
    setFavoriteGroup(false);
  };
  const handleActionButtonLeaveClick = () => {
    deleteUserGroup(currentUser.uid, groupId);
    setFavoriteGroup(false);
    setCurrentMember(false);
    setCount(count - 1);
  };
  const handleActionButtonPendingInviteClick = () => {
    deleteUserGroupInvite(currentUser.uid, groupId);
    setGroupInvited(false);
  };
  const handleActionButtonAcceptInviteClick = () => {
    setUserGroup(groupId, currentUser.uid, false);
    setFavoriteGroup(false);
    setCurrentMember(true);
    setGroupInvited(false);
    setCurrentUserInvited(false);
    setCount(count + 1);
  };
  const handleActionButtonInviteClick = () => {
    setUserGroupInvite(currentUser.uid, groupId);
    setGroupInvited(true);
  };

  // HANDLE BUTTONS
  let favButtonIcon;
  let favButtonText;
  let favButtonOnClick;
  if (currentMember) {
    if (favoriteGroup) {
      favButtonIcon = <StarIcon className="h-5 w-5" />;
      favButtonText = "Favorite group";
      favButtonOnClick = handleFavoriteButtonFavoriteClick;
    } else {
      favButtonIcon = <UserGroupIcon className="h-5 w-5" />;
      favButtonText = "Group";
      favButtonOnClick = handleFavoriteButtonGroupClick;
    }
  }

  let actionButtonIcon;
  let actionButtonText;
  let actionButtonOnClick;
  if (currentMember) {
    actionButtonIcon = <UserMinusIcon className="h-5 w-5" />;
    actionButtonText = "Leave group";
    actionButtonOnClick = handleActionButtonLeaveClick;
  } else {
    if (groupInvited) {
      actionButtonIcon = <EllipsisHorizontalIcon className="h-5 w-5" />;
      actionButtonText = "Join request pending";
      actionButtonOnClick = handleActionButtonPendingInviteClick;
    } else if (currentUserInvited) {
      actionButtonIcon = <CheckIcon className="h-5 w-5" />;
      actionButtonText = "Accept group invite";
      actionButtonOnClick = handleActionButtonAcceptInviteClick;
    } else {
      actionButtonIcon = <UserPlusIcon className="h-5 w-5" />;
      actionButtonText = "Send join request";
      actionButtonOnClick = handleActionButtonInviteClick;
    }
  }

  return (
    <div className="relative mb-4">
      <img
        alt=""
        src={
          changedBackground
            ? URL.createObjectURL(changedBackground)
            : backgroundURL
        }
        className="rounded-b-md object-cover object-center"
      />
      <div className="py-6 px-9">
        <div className="absolute bottom-0">
          <img
            alt=""
            src={
              changedProfile ? URL.createObjectURL(changedProfile) : avatarURL
            }
            className="h-[200px] w-[200px] rounded-full object-cover object-center border-4 border-background bg-avatar"
          />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col pl-[13.5rem] gap-2">
            <Typography className="text-4xl font-bold text-text-1">
              {displayName}
            </Typography>
            <div className="flex gap-3 text-sm font-semibold text-text-3">
              <div className="flex gap-1 items-center">
                <GlobeAltIcon className="h-4 w-4" />
                {isPublic ? "Public group" : "Private group"}
              </div>
              <div className="flex gap-1 items-center">
                <UserGroupIcon className="h-4 w-4" />
                {`${count} ${count === 1 ? "member" : "members"}`}
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {isAdmin ? (
              <>
                <input
                  type="file"
                  ref={profileInputRef}
                  onChange={handleProfileChange}
                  accept="image/*"
                  hidden
                />
                <CustomButton
                  icon={<CameraIcon className="h-5 w-5" />}
                  text={"Edit profile image"}
                  onClick={handleProfileClick}
                  colored={false}
                />
                <input
                  type="file"
                  ref={backgroundInputRef}
                  onChange={handleBackgroundChange}
                  accept="image/*"
                  hidden
                />
                <CustomButton
                  icon={<PhotoIcon className="h-5 w-5" />}
                  text={"Edit background image"}
                  onClick={handleBackgroundClick}
                  colored={false}
                />
              </>
            ) : (
              <>
                {currentMember && (
                  <CustomButton
                    icon={favButtonIcon}
                    text={favButtonText}
                    onClick={favButtonOnClick}
                    colored={false}
                  />
                )}
                <CustomButton
                  icon={actionButtonIcon}
                  text={actionButtonText}
                  onClick={actionButtonOnClick}
                  colored={false}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomGroupProfileTop;
