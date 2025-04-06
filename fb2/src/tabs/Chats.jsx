import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { CursorArrowRippleIcon } from "@heroicons/react/24/outline";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import CustomChat from "components/chats/CustomChat";
import CustomChatsList from "components/chats/CustomChatsList";
import CustomGroupChatsList from "components/chats/CustomGroupChatsList";
import CustomChatsMenu from "components/chats/CustomChatsMenu";
import CustomGroupChatsMenu from "components/chats/CustomGroupChatsMenu";
import {
  db,
  getChatData,
  getChatMessage,
  getGroupChatData,
  getGroupChatMessage,
  getGroupChatProfileData,
  getUserChatData,
  getUserProfileData,
} from "apis/firebase";
import LoadIndicator from "components/indicators/LoadIndicator";
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import CustomGroupChat from "components/chats/CustomGroupChat";

const Chats = () => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const location = useLocation();

  // FETCHING CHATS
  const [chats, setChats] = useState([]);
  const [chatsLoaded, setChatsLoaded] = useState(false);

  const modifyUserChat = async (userChat) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === userChat.id)
          return {
            ...chat,
            lastActive: userChat.lastActive.toDate(),
          };
        return chat;
      })
    );
  };

  const fetchChats = async () => {
    const userChatsQuery = query(
      collection(db, "userChats", currentUser.uid, "chats")
    );
    const unsubscribe = onSnapshot(userChatsQuery, async (snapshot) => {
      if (chatsLoaded) {
        const userChatChanges = snapshot.docChanges();
        userChatChanges.forEach(async (change) => {
          const userChat = change.doc.data();
          if (change.type === "modified") await modifyUserChat(userChat);
        });
      } else {
        const userChats = snapshot.docs.map((docum) => docum.data());
        const matchedChats = [];
        for (const userChat of userChats) {
          const partner = await getUserProfileData(userChat.partner);
          const partnerChat = await getUserChatData(
            userChat.partner,
            userChat.id
          );
          const chat = await getChatData(userChat.id);
          let lastMessage = null;
          if (chat.lastMessage)
            lastMessage = await getChatMessage(chat.id, chat.lastMessage);
          matchedChats.push({
            id: chat.id,
            partnerId: partner.id,
            avatarURL: partner.avatarURL,
            displayName: partner.displayName,
            lastActive: userChat.lastActive.toDate(),
            isMuted: userChat.isMuted,
            isBlocked: userChat.isBlocked,
            partnerLastActive: partnerChat.lastActive,
            partnerIsMuted: partnerChat.isMuted,
            partnerIsBlocked: partnerChat.isBlocked,
            creationDate: chat.creationDate.toDate(),
            lastMessage: lastMessage,
          });
        }
        await setChats(matchedChats);
        setChatsLoaded(true);
      }
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const modifyChat = async (chatId, lastMessage) => {
    setChats((prevChats) =>
      prevChats.map((prevChat) => {
        if (prevChat.id === chatId)
          return {
            ...prevChat,
            lastMessage: lastMessage,
          };

        return prevChat;
      })
    );
  };

  const fetchChatLastMessages = async () => {
    for (const chat of chats) {
      const chatRef = doc(db, "chats", chat.id);
      onSnapshot(chatRef, async (doc) => {
        if (doc.exists()) {
          const chat = await getChatData(doc.id);
          let lastMessage = null;
          if (chat.lastMessage)
            lastMessage = await getChatMessage(doc.id, chat.lastMessage);
          await modifyChat(doc.id, lastMessage);
        }
      });
    }
  };

  useEffect(() => {
    if (chats) fetchChatLastMessages();
  }, [chats.length]);

  // FETCHING GROUP CHATS
  const [groupChats, setGroupChats] = useState([]);
  const [groupChatsLoaded, setGroupChatsLoaded] = useState(false);

  const modifyUserGroupChat = async (userGroupChat) => {
    setGroupChats((prevGroupChats) =>
      prevGroupChats.map((groupChat) => {
        if (groupChat.id === userGroupChat.id)
          return {
            ...groupChat,
            lastActive: userGroupChat.lastActive.toDate(),
          };
        return groupChat;
      })
    );
  };

  const fetchGroupChats = async () => {
    const userGroupChatsQuery = query(
      collection(db, "userGroupChats", currentUser.uid, "groupChats")
    );
    const unsubscribe = onSnapshot(userGroupChatsQuery, async (snapshot) => {
      if (groupChatsLoaded) {
        const userGroupChatChanges = snapshot.docChanges();
        userGroupChatChanges.forEach(async (change) => {
          const userGroupChat = change.doc.data();
          if (change.type === "modified")
            await modifyUserGroupChat(userGroupChat);
        });
      } else {
        const userGroupChats = snapshot.docs.map((docum) => docum.data());
        const matchedChats = [];
        for (const userGroupChat of userGroupChats) {
          const groupChatProfile = await getGroupChatProfileData(
            userGroupChat.id
          );
          const groupChat = await getGroupChatData(userGroupChat.id);
          let lastMessage = null;
          if (groupChat.lastMessage)
            lastMessage = await getGroupChatMessage(
              groupChat.id,
              groupChat.lastMessage
            );
          matchedChats.push({
            id: groupChat.id,
            avatarURL: groupChatProfile.avatarURL,
            displayName: groupChatProfile.displayName,
            joinDate: userGroupChat.joinDate.toDate(),
            lastActive: userGroupChat.lastActive.toDate(),
            isMuted: userGroupChat.isMuted,
            creationDate: groupChat.creationDate.toDate(),
            lastMessage: lastMessage,
          });
        }
        await setGroupChats(matchedChats);
        setGroupChatsLoaded(true);
      }
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    fetchGroupChats();
  }, []);

  const modifyGroupChat = async (chatId, lastMessage) => {
    setGroupChats((prevGroupChats) =>
      prevGroupChats.map((prevGroupChat) => {
        if (prevGroupChat.id === chatId)
          return {
            ...prevGroupChat,
            lastMessage: lastMessage,
          };

        return prevGroupChat;
      })
    );
  };

  const fetchGroupChatLastMessages = async () => {
    for (const groupChat of groupChats) {
      const groupChatRef = doc(db, "chats", groupChat.id);
      onSnapshot(groupChatRef, async (doc) => {
        if (doc.exists()) {
          const groupChat = await getChatData(doc.id);
          let lastMessage = null;
          if (groupChat.lastMessage)
            lastMessage = await getGroupChatMessage(
              doc.id,
              groupChat.lastMessage
            );
          await modifyGroupChat(doc.id, lastMessage);
        }
      });
    }
  };

  useEffect(() => {
    if (groupChats) fetchGroupChatLastMessages();
  }, [groupChats.length]);

  // HANDLING TABS
  const [activeTab, setActiveTab] = useState(0);

  // HANDLING CHATS
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [activeChatKey, setActiveChatKey] = useState(0);
  const [activeGroupChat, setActiveGroupChat] = useState(null);
  const [activeGroupChatKey, setActiveGroupChatKey] = useState(0);

  useEffect(() => {
    setActiveChatId(null);
    const path = location.pathname;
    const match = path.match(/^\/chats\/(.+)$/);
    if (match) {
      const chatId = match[1];
      setActiveChatId(chatId);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (activeChatId && chatsLoaded && groupChatsLoaded) {
      setActiveChat(null);
      setActiveGroupChat(null);
      const chat = chats.find((item) => item.id === activeChatId);
      if (chat) {
        setActiveChatId(chat.id);
        setActiveChat(chat);
        setActiveChatKey((prevKey) => prevKey + 1);
        return;
      }
      const groupChat = groupChats.find((item) => item.id === activeChatId);
      if (groupChat) {
        setActiveChatId(groupChat.id);
        setActiveGroupChat(groupChat);
        setActiveGroupChatKey((prevKey) => prevKey + 1);
        return;
      }
    }
  }, [activeChatId, chatsLoaded, groupChatsLoaded]);

  return (
    <div className="wrapper flex">
      <div className="h-panel flex flex-col w-1/4 border-r border-secondary-3">
        {activeTab === 0 && <CustomChatsMenu chats={chats} />}
        {activeTab === 1 && <CustomGroupChatsMenu chats={groupChats} />}
        <div className="overflow-auto">
          <Tabs value={activeTab}>
            <TabsHeader
              className="p-2 bg-transparent"
              indicatorProps={{
                className: "bg-secondary-4",
              }}
            >
              <Tab
                key={0}
                value={0}
                onClick={() => setActiveTab(0)}
                className="p-1 rounded-md text-base font-semibold text-primary-1"
              >
                Private
              </Tab>
              <Tab
                key={1}
                value={1}
                onClick={() => setActiveTab(1)}
                className="p-1 rounded-md text-base font-semibold text-primary-1"
              >
                Group
              </Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel key={0} value={0}>
                {chatsLoaded ? (
                  <CustomChatsList chats={chats} activeChatId={activeChatId} />
                ) : (
                  <LoadIndicator />
                )}
              </TabPanel>
              <TabPanel key={1} value={1}>
                {groupChatsLoaded ? (
                  <CustomGroupChatsList
                    groupChats={groupChats}
                    activeChatId={activeChatId}
                  />
                ) : (
                  <LoadIndicator />
                )}
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
      <div className="w-3/4">
        {activeChatId ? (
          activeChat || activeGroupChat ? (
            activeChat ? (
              <CustomChat key={activeChatKey} chat={activeChat} />
            ) : (
              <CustomGroupChat
                key={activeGroupChatKey}
                chat={activeGroupChat}
              />
            )
          ) : (
            <LoadIndicator />
          )
        ) : (
          <div className="flex flex-col w-full h-full items-center justify-center bg-container">
            <ChatBubbleOvalLeftEllipsisIcon className="h-44 w-44 text-primary-2" />
            <CursorArrowRippleIcon className="h-36 w-36 -mt-24 ml-20 text-text-2" />
            <Typography
              variant="h5"
              color="blue-gray"
              className="font-bold text-text-2"
            >
              No chat selected
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
