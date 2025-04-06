import React, { useEffect, useState } from "react";
import CustomHomeFriendsList from "./CustomHomeFriendsList";
import {
  getGroupChatProfileData,
  getGroupProfileData,
  getUserChatData,
  getUserChatsData,
  getUserFriendsData,
  getUserGroupChatData,
  getUserGroupChatsData,
  getUserGroupsData,
  getUserProfileData,
} from "apis/firebase";
import { useAuth } from "contexts/AuthContext";
import CustomHomeGroupsList from "./CustomHomeGroupsList";
import CustomHomeChatsList from "./CustomHomeChatsList";

const CustomHomeChats = () => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // FETCHING CHATS
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const userChats = await getUserChatsData(currentUser.uid);
    const matchedChats = [];
    for (const userChat of userChats) {
      const partner = await getUserProfileData(userChat.partner);
      const partnerChat = await getUserChatData(userChat.partner, userChat.id);
      matchedChats.push({
        id: userChat.id,
        partnerId: partner.id,
        avatarURL: partner.avatarURL,
        displayName: partner.displayName,
        partnerLastActive: partnerChat.lastActive,
      });
    }
    setChats(matchedChats);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // FETCHING GROUP CHATS
  const [groupChats, setGroupChats] = useState([]);

  const fetchGroupChats = async () => {
    const userChats = await getUserGroupChatsData(currentUser.uid);
    const matchedChats = [];
    for (const userChat of userChats) {
      const chat = await getGroupChatProfileData(userChat.id);
      matchedChats.push({
        id: userChat.id,
        avatarURL: chat.avatarURL,
        displayName: chat.displayName,
      });
    }
    setGroupChats(matchedChats);
  };

  useEffect(() => {
    fetchGroupChats();
  }, []);

  return (
    <div className="flex flex-col p-4 pb-2 gap-4">
      <h1 className="text-xl text-text-1 font-bold">Chats</h1>
      <CustomHomeChatsList chats={chats} />
      <h1 className="text-xl text-text-1 font-bold">Group Chats</h1>
      <CustomHomeChatsList chats={groupChats} />
    </div>
  );
};

export default CustomHomeChats;
