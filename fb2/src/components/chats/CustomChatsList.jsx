import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
  Input,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "contexts/AuthContext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import CustomChat from "./CustomChat";

const CustomChatsList = () => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  const [chatsListItems, setChatsListItems] = useState([]);
  const fetchChats = async () => {
    if (currentUser) {
      const currentUserId = currentUser.uid;
      const chatsQuery = query(
        collection(db, "chats"),
        where("members", "array-contains", currentUserId)
      );
      const chatsSnapshot = await getDocs(chatsQuery);

      const chatsData = [];
      for (const docum of chatsSnapshot.docs) {
        const chatData = docum.data();
        const otherUserId =
          chatData.members[0] === currentUserId
            ? chatData.members[1]
            : chatData.members[0];
        if (otherUserId) {
          const otherUserSnapshot = await getDoc(doc(db, "users", otherUserId));
          const otherUser = otherUserSnapshot.exists
            ? otherUserSnapshot.data()
            : null;
          if (otherUser) {
            chatsData.push({
              id: docum.id,
              members: chatData.members,
              creationDate: chatData.creationDate,
              avatar: otherUser.avatar,
              displayName: otherUser.displayName,
              lastMsg: "nothing",
              lastRead: true,
              youLast: false,
            });
          }
        }
      }
      setChatsListItems(chatsData);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // HANDLING CHATS
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatAvatar, setActiveChatAvatar] = useState(null);
  const [activeChatDisplayName, setActiveChatDisplayName] = useState(null);
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const chatActive = (chatId) => {
    return activeChatId === chatId;
  };
  const handleChatClick = (chatId) => {
    navigate(`/chats/${chatId}`);
  };

  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/^\/chats\/(.+)$/);
    if (match) {
      const chatId = match[1];
      const chat = chatsListItems.find((item) => item.id === chatId);
      if (chat) {
        setActiveChatId(chatId);
        setActiveChatAvatar(chat.avatar);
        setActiveChatDisplayName(chat.displayName);
        setActiveChatMessages(chat.messages);
        return;
      }
    }
    setActiveChatId(null);
    setActiveChatAvatar(null);
    setActiveChatDisplayName(null);
    setActiveChatMessages([]);
  }, [chatsListItems, location.pathname]);

  return (
    <div className="wrapper flex">
      <div className="h-panel flex flex-col w-1/4 border-r border-secondary-3">
        <div className="flex flex-col p-4 pb-2 gap-4">
          <h1 className="text-2xl text-text-1 font-bold">Chats</h1>
          <Input
            type="text"
            placeholder="Search for chats"
            maxLength={50}
            color="teal"
            className="text-text-1 !border-secondary-2 placeholder:text-text-4 focus:!border-primary-1"
            labelProps={{
              className: "hidden",
            }}
            containerProps={{
              className: "min-w-[10rem] h-9 bg-secondary-4 rounded-lg",
            }}
            icon={<MagnifyingGlassIcon />}
            crossOrigin={undefined}
          />
        </div>
        <div className="overflow-auto">
          <Card className="shadow-none rounded-none bg-background">
            <List>
              {chatsListItems.map(
                ({
                  id,
                  displayName,
                  avatar,
                  members,
                  creationDate,
                  lastMsg,
                  lastRead,
                  youLast,
                }) => {
                  return (
                    <ListItem
                      onClick={() => handleChatClick(id)}
                      selected={chatActive(id)}
                      className={`hover:bg-secondary-4 active:bg-secondary-4 ${
                        activeChatId === id ? "!bg-primary-1/20" : ""
                      }`}
                    >
                      <ListItemPrefix>
                        <Avatar
                          alt=""
                          src={avatar}
                          className="border border-secondary-1 bg-avatar"
                        />
                      </ListItemPrefix>
                      <div className="space-y-1">
                        <Typography className="text-sm font-semibold text-text-1">
                          {displayName}
                        </Typography>
                        <Typography
                          className={`flex text-xs font-normal text-text-3 ${
                            lastRead ? "" : "font-medium text-text-1"
                          }`}
                        >
                          <PaperAirplaneIcon
                            className={`h-4 w-4 mx-1 ${
                              youLast ? "rotate-180" : ""
                            }`}
                          />
                          {lastMsg.length > 30
                            ? `${lastMsg.slice(0, 30)} ...`
                            : lastMsg}
                        </Typography>
                      </div>
                    </ListItem>
                  );
                }
              )}
            </List>
          </Card>
        </div>
      </div>
      <div className="w-3/4">
        <CustomChat
          avatar={activeChatAvatar}
          displayName={activeChatDisplayName}
          messages={activeChatMessages}
        />
      </div>
    </div>
  );
};

export default CustomChatsList;
