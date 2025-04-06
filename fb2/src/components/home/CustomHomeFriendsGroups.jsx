import React, { useEffect, useState } from "react";
import CustomHomeFriendsList from "./CustomHomeFriendsList";
import {
  getGroupProfileData,
  getUserFriendsData,
  getUserGroupsData,
  getUserProfileData,
} from "apis/firebase";
import { useAuth } from "contexts/AuthContext";
import CustomHomeGroupsList from "./CustomHomeGroupsList";

const CustomHomeFriendsGroups = () => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // FETCHING FRIENDS
  const [friends, setFriends] = useState([]);

  const fetchFriends = async () => {
    const friends = await getUserFriendsData(currentUser.uid);
    const matchedFriends = [];
    for (const friend of friends) {
      const friendProfile = await getUserProfileData(friend.id);
      matchedFriends.push({
        id: friend.id,
        avatarURL: friendProfile.avatarURL,
        displayName: friendProfile.displayName,
        lastActive: friendProfile.lastActive.toDate(),
        startDate: friend.startDate.toDate(),
        isClose: friend.isClose,
      });
    }
    setFriends(matchedFriends);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // FETCHING GROUPS
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    const groups = await getUserGroupsData(currentUser.uid);
    console.log(groups.length);
    const matchedGroups = [];
    for (const group of groups) {
      const groupProfile = await getGroupProfileData(group.id);
      matchedGroups.push({
        id: group.id,
        avatarURL: groupProfile.avatarURL,
        displayName: groupProfile.displayName,
        joinDate: group.joinDate.toDate(),
        isFavorite: group.isFavorite,
      });
    }
    setGroups(matchedGroups);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="flex flex-col p-4 pb-2 gap-4">
      <h1 className="text-xl text-text-1 font-bold">Friends</h1>
      <CustomHomeFriendsList friends={friends} />
      <h1 className="text-xl text-text-1 font-bold">Groups</h1>
      <CustomHomeGroupsList groups={groups} />
    </div>
  );
};

export default CustomHomeFriendsGroups;
