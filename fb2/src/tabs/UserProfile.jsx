import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import {
  getUserAboutData,
  getUserFriendData,
  getUserPrefsData,
  getUserProfileData,
  isUserFriend,
  isUserFriendInviteReceived,
  isUserFriendInviteSent,
} from "apis/firebase";
import CustomUserProfileTop from "components/userProfile/CustomUserProfileTop";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import CustomUserProfileTabs from "components/userProfile/CustomUserProfileTabs";

const UserProfile = () => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  // FETCHING THE USER
  const [user, setUser] = useState(null);

  const fetchUser = async (userId) => {
    const userProfile = await getUserProfileData(userId);
    const userPrefs = await getUserPrefsData(userId);
    const userAbout = await getUserAboutData(userId);
    const isFriend = await isUserFriend(currentUser.uid, userId);
    let startDate = null;
    let isClose = false;
    if (isFriend) {
      const userFriend = await getUserFriendData(currentUser.uid, userId);
      startDate = userFriend.startDate.toDate();
      isClose = userFriend.isClose;
    }
    const isInviteSent = await isUserFriendInviteSent(currentUser.uid, userId);
    const isInviteReceived = await isUserFriendInviteReceived(
      currentUser.uid,
      userId
    );
    const matchedUser = {
      id: userId,
      avatarURL: userProfile.avatarURL,
      displayName: userProfile.displayName,
      isPublic: userPrefs.isPublic,
      firstName: userAbout.firstName,
      lastName: userAbout.lastName,
      email: userAbout.email,
      isMale: userAbout.isMale,
      birthdate: userAbout.birthdate.toDate(),
      postalCode: userAbout.postalCode,
      city: userAbout.city,
      country: userAbout.country,
      phoneNumber: userAbout.phoneNumber,
      backgroundURL: userAbout.backgroundURL,
      friendCount: userAbout.friendCount,
      creationDate: userAbout.creationDate.toDate(),
      isFriend: isFriend,
      startDate: startDate,
      isClose: isClose,
      isInviteSent: isInviteSent,
      isInviteReceived: isInviteReceived,
    };
    setUser(matchedUser);
  };

  useEffect(() => {
    setUser(null);
    const path = location.pathname;
    const match = path.match(/^\/profile\/user\/(.+)$/);
    if (match) {
      const userId = match[1];
      fetchUser(userId);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-1 justify-center">
      <div className="flex flex-col w-4/5">
        {user ? (
          <>
            <CustomUserProfileTop
              userId={user.id}
              avatarURL={user.avatarURL}
              backgroundURL={user.backgroundURL}
              displayName={user.displayName}
              friendCount={user.friendCount}
              isPublic={user.isPublic}
              isFriend={user.isFriend}
              isClose={user.isClose}
              isInviteSent={user.isInviteSent}
              isInviteReceived={user.isInviteReceived}
            />
            <CustomUserProfileTabs />
          </>
        ) : (
          <div className="flex flex-1 p-4 justify-center">
            <ArrowPathIcon className="h-7 w-7 text-text-1 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
