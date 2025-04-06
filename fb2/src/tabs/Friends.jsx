import {
  getUserFriendKeywordSetsData,
  getUserFriendsData,
  getUserProfileData,
} from "apis/firebase";
import CustomFriends from "components/friends/CustomFriends";
import CustomFriendsMenu from "components/friends/CustomFriendsMenu";
import CustomSearchInput from "components/inputs/CustomSearchInput";
import { useAuth } from "contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Friends() {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  // FETCHING FRIENDS
  const [friends, setFriends] = useState([]);

  const fetchFriends = async () => {
    const userFriends = await getUserFriendsData(currentUser.uid);
    const matchedFriends = [];
    for (const userFriend of userFriends) {
      const friend = await getUserProfileData(userFriend.id);
      matchedFriends.push(friend);
    }
    setFriends(matchedFriends);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // SEARCHING FOR FRIENDS
  const [foundFriends, setFoundFriends] = useState([]);

  const handleSearch = async (term) => {
    const userFriends = await getUserFriendKeywordSetsData(
      currentUser.uid,
      term
    );
    const matchedFriends = [];
    for (const userFriend of userFriends) {
      const friend = friends.find((user) => user.id === userFriend.id);
      if (friend) matchedFriends.push(friend);
    }
    setFoundFriends(matchedFriends);
  };

  // HANDLE FRIEND SEARCH RESULT CLICK
  const handleFriendResultClick = (userId) => {
    const friend = foundFriends.find((user) => user.id === userId);
    if (friend) navigate(`/profile/user/${friend.id}`);
  };

  return (
    <div className="wrapper flex">
      <div className="h-panel flex flex-col w-1/4 border-r border-secondary-3">
        <div className="flex flex-col p-4 pb-2 gap-4">
          <h1 className="text-2xl text-text-1 font-bold">Friends</h1>
          <CustomSearchInput
            placeholder={"Search for friends"}
            onSearch={handleSearch}
            results={foundFriends}
            onResultClick={handleFriendResultClick}
          />
        </div>
        <div className="overflow-auto">
          <CustomFriendsMenu />
        </div>
      </div>
      <div className="w-3/4 bg-container">
        <CustomFriends />
      </div>
    </div>
  );
}

export default Friends;
