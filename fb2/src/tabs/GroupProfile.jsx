import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import {
  getGroupAboutData,
  getGroupPrefsData,
  getGroupProfileData,
  getUserGroupData,
  isUserGroupInviteReceived,
  isUserGroupInviteSent,
  isUserGroupMember,
} from "apis/firebase";
import CustomGroupProfileTop from "components/groupProfile/CustomGroupProfileTop";
import CustomGroupProfileTabs from "components/groupProfile/CustomGroupProfileTabs";
import LoadIndicator from "components/indicators/LoadIndicator";

const GroupProfile = () => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  // FETCHING THE GROUP
  const [group, setGroup] = useState(null);

  const fetchGroup = async (groupId) => {
    const groupProfile = await getGroupProfileData(groupId);
    if (groupProfile) {
      const groupPrefs = await getGroupPrefsData(groupId);
      const groupAbout = await getGroupAboutData(groupId);
      const isMember = await isUserGroupMember(currentUser.uid, groupId);
      let joinDate = null;
      let isFavorite = false;
      if (isMember) {
        const userGroup = await getUserGroupData(currentUser.uid, groupId);
        joinDate = userGroup.joinDate.toDate();
        isFavorite = userGroup.isFavorite;
      }
      const isInviteSent = await isUserGroupInviteSent(
        currentUser.uid,
        groupId
      );
      const isInviteReceived = await isUserGroupInviteReceived(
        currentUser.uid,
        groupId
      );
      const matchedGroup = {
        id: groupId,
        avatarURL: groupProfile.avatarURL,
        displayName: groupProfile.displayName,
        isPublic: groupPrefs.isPublic,
        isSafeForWork: groupPrefs.isSafeForWork,
        description: groupAbout.description,
        memberCount: groupAbout.memberCount,
        backgroundURL: groupAbout.backgroundURL,
        creationDate: groupAbout.creationDate.toDate(),
        isMember: isMember,
        joinDate: joinDate,
        isFavorite: isFavorite,
        isInviteSent: isInviteSent,
        isInviteReceived: isInviteReceived,
      };
      setGroup(matchedGroup);
    }
  };

  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/^\/profile\/group\/(.+)$/);
    if (match) {
      const groupId = match[1];
      fetchGroup(groupId);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-1 justify-center">
      <div className="flex flex-col w-4/5">
        {group ? (
          <>
            <CustomGroupProfileTop
              groupId={group.id}
              avatarURL={group.avatarURL}
              backgroundURL={group.backgroundURL}
              displayName={group.displayName}
              description={group.description}
              memberCount={group.memberCount}
              isPublic={group.isPublic}
              isSafeForWork={group.isSafeForWork}
              isMember={group.isMember}
              isFavorite={group.isFavorite}
              isInviteSent={group.isInviteSent}
              isInviteReceived={group.isInviteReceived}
            />
            <CustomGroupProfileTabs />
          </>
        ) : (
          <LoadIndicator />
        )}
      </div>
    </div>
  );
};

export default GroupProfile;
