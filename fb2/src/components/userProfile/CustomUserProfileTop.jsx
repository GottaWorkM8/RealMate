import { GlobeAltIcon } from "@heroicons/react/24/outline";
import {
  CameraIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CheckIcon,
  EllipsisHorizontalIcon,
  FireIcon,
  PhotoIcon,
  UserIcon,
  UserMinusIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { Badge, Typography } from "@material-tailwind/react";
import {
  deleteUserFriend,
  deleteUserFriendInvite,
  getUserChatsWithPartnerData,
  setChat,
  setUserFriend,
  setUserFriendInvite,
  updateUserBackgroundImage,
  updateUserFriendIsClose,
  updateUserProfileImage,
} from "apis/firebase";
import CustomButton from "components/buttons/CustomButton";
import { useAuth } from "contexts/AuthContext";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { compressBackgroundImage, compressProfileImage } from "utils";

const CustomUserProfileTop = ({
  userId,
  avatarURL,
  backgroundURL,
  displayName,
  friendCount,
  isPublic,
  isFriend,
  isClose,
  isInviteSent,
  isInviteReceived,
}) => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // UPLOADING NEW PROFILE IMAGE
  const profileInputRef = useRef(null);

  const handleProfileClick = () => {
    profileInputRef.current.click();
  };
  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressedFile = await compressProfileImage(file);
    updateUserProfileImage(currentUser, compressedFile);
    e.target.value = null;
    console.log("Profile uploaded:", file.name);
  };

  // UPLOADING NEW BACKGROUND IMAGE
  const backgroundInputRef = useRef(null);

  const handleBackgroundClick = () => {
    backgroundInputRef.current.click();
  };
  const handleBackgroundChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressedFile = await compressBackgroundImage(file);
    updateUserBackgroundImage(currentUser.uid, compressedFile);
    e.target.value = null;
    console.log("Background uploaded:", file.name);
  };

  // STATES
  const [count, setCount] = useState(friendCount);
  const [closeFriend, setCloseFriend] = useState(isClose);
  const [currentFriend, setCurrentFriend] = useState(isFriend);
  const [userInvited, setUserInvited] = useState(isInviteSent);
  const [currentUserInvited, setCurrentUserInvited] =
    useState(isInviteReceived);

  // HANDLE BUTTON CLICKS
  const handleCloseButtonFriendClick = () => {
    updateUserFriendIsClose(currentUser.uid, userId, true);
    setCloseFriend(true);
  };
  const handleCloseButtonCloseClick = () => {
    updateUserFriendIsClose(currentUser.uid, userId, false);
    setCloseFriend(false);
  };
  const handleActionButtonRemoveClick = () => {
    deleteUserFriend(currentUser.uid, userId);
    setCloseFriend(false);
    setCurrentFriend(false);
    setCount(count - 1);
  };
  const handleActionButtonPendingInviteClick = () => {
    deleteUserFriendInvite(currentUser.uid, userId);
    setUserInvited(false);
  };
  const handleActionButtonAcceptInviteClick = () => {
    setUserFriend(currentUser.uid, userId);
    setCloseFriend(false);
    setCurrentFriend(true);
    setUserInvited(false);
    setCurrentUserInvited(false);
    setCount(count + 1);
  };
  const handleActionButtonInviteClick = () => {
    setUserFriendInvite(currentUser.uid, userId);
    setUserInvited(true);
  };
  const messageButtonOnClick = async () => {
    const userChatsWithPartner = await getUserChatsWithPartnerData(
      currentUser.uid,
      userId
    );
    const userChat = await userChatsWithPartner[0];
    if (userChat) {
      navigate(`/chats/${userChat.id}`);
    } else {
      const chatId = await setChat(currentUser.uid, userId);
      navigate(`/chats/${chatId}`);
    }
  };

  // HANDLE BUTTONS
  let closeButtonIcon;
  let closeButtonText;
  let closeButtonOnClick;
  if (currentFriend) {
    if (closeFriend) {
      closeButtonIcon = <FireIcon className="h-5 w-5" />;
      closeButtonText = "Close friend";
      closeButtonOnClick = handleCloseButtonCloseClick;
    } else {
      closeButtonIcon = <UserIcon className="h-5 w-5" />;
      closeButtonText = "Friend";
      closeButtonOnClick = handleCloseButtonFriendClick;
    }
  }

  let actionButtonIcon;
  let actionButtonText;
  let actionButtonOnClick;
  if (currentFriend) {
    actionButtonIcon = <UserMinusIcon className="h-5 w-5" />;
    actionButtonText = "Remove friend";
    actionButtonOnClick = handleActionButtonRemoveClick;
  } else {
    if (userInvited) {
      actionButtonIcon = <EllipsisHorizontalIcon className="h-5 w-5" />;
      actionButtonText = "Friend invite pending";
      actionButtonOnClick = handleActionButtonPendingInviteClick;
    } else if (currentUserInvited) {
      actionButtonIcon = <CheckIcon className="h-5 w-5" />;
      actionButtonText = "Accept friend invite";
      actionButtonOnClick = handleActionButtonAcceptInviteClick;
    } else {
      actionButtonIcon = <UserPlusIcon className="h-5 w-5" />;
      actionButtonText = "Send friend invite";
      actionButtonOnClick = handleActionButtonInviteClick;
    }
  }

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
                {isPublic ? "Public user" : "Private user"}
              </div>
              <div className="flex gap-1 items-center">
                <UsersIcon className="h-4 w-4" />
                {`${count} ${count === 1 ? "friend" : "friends"}`}
              </div>
            </Typography>
          </div>
          <div className="flex gap-2 items-center">
            {currentUser.uid === userId ? (
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
                {currentFriend && (
                  <CustomButton
                    icon={closeButtonIcon}
                    text={closeButtonText}
                    onClick={closeButtonOnClick}
                    colored={false}
                  />
                )}
                <CustomButton
                  icon={actionButtonIcon}
                  text={actionButtonText}
                  onClick={actionButtonOnClick}
                  colored={false}
                />
                <CustomButton
                  icon={<ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />}
                  text={"Message"}
                  onClick={messageButtonOnClick}
                  colored={true}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomUserProfileTop;
