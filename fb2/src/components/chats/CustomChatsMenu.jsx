import React, { useState, useEffect } from "react";
import { useAuth } from "contexts/AuthContext";
import CustomSearchInput from "components/inputs/CustomSearchInput";
import { useNavigate } from "react-router-dom";
import { getUserChatKeywordSetsData } from "apis/firebase";

const CustomChatsMenu = ({ chats }) => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // SEARCHING FOR CHATS
  const [foundChats, setFoundChats] = useState([]);

  const handleSearch = async (term) => {
    const chatKeywordSets = await getUserChatKeywordSetsData(
      currentUser.uid,
      term
    );
    const matchedChats = [];
    for (const chatKeywordSet of chatKeywordSets) {
      const userChat = chats.find(
        (chat) => chat.partnerId === chatKeywordSet.partner
      );
      if (userChat) matchedChats.push(userChat);
    }
    setFoundChats(matchedChats);
  };

  // HANDLING SEARCH RESULT CLICK
  const handleResultClick = (chatId) => {
    navigate(`/chats/${chatId}`);
  };

  return (
    <div className="flex flex-col p-4 pb-2 gap-4">
      <h1 className="text-2xl text-text-1 font-bold">Chats</h1>
      <CustomSearchInput
        placeholder="Search for chats"
        onSearch={handleSearch}
        results={foundChats}
        onResultClick={handleResultClick}
      />
    </div>
  );
};

export default CustomChatsMenu;
