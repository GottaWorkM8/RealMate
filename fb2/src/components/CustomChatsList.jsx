import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// CHATS LIST ITEMS
const chatsListItems = [
  {
    id: 0,
    name: "Frederick Zimmer",
    lastMsg: "good night",
    lastRead: false,
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    youLast: false,
  },
  {
    id: 1,
    name: "Naughty Frogs",
    lastMsg: "xD",
    lastRead: false,
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80",
    youLast: false,
  },
  {
    id: 2,
    name: "PayPal",
    lastMsg: "bomboclat",
    lastRead: true,
    avatar:
      "https://dwglogo.com/wp-content/uploads/2016/08/PayPal_Logo_Icon.png",
    youLast: true,
  },
  {
    id: 3,
    name: "Annie Smith",
    lastMsg: "Hold on, afk for a sec",
    lastRead: false,
    avatar: "https://docs.material-tailwind.com/img/face-1.jpg",
    youLast: false,
  },
  {
    id: 4,
    name: "Peter Gold",
    lastMsg:
      "what that guy said yesterday made my absolutely furious, would punch him if it wouldn't cost me a job",
    lastRead: true,
    avatar: "https://docs.material-tailwind.com/img/face-2.jpg",
    youLast: true,
  },
  {
    id: 5,
    name: "Andrew Tate",
    lastMsg: "c u tomorrow",
    lastRead: true,
    avatar: "https://docs.material-tailwind.com/img/face-3.jpg",
    youLast: true,
  },
  {
    id: 6,
    name: "John Wozniak",
    lastMsg: "gg",
    lastRead: false,
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    youLast: false,
  },
  {
    id: 7,
    name: "Jennifer Ford",
    lastMsg: "do your best :)",
    lastRead: true,
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80",
    youLast: false,
  },
  {
    id: 8,
    name: "Moni Ferguson",
    lastMsg: "When are you free?",
    lastRead: true,
    avatar: "https://docs.material-tailwind.com/img/face-3.jpg",
    youLast: true,
  },
];

const CustomChatsList = () => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  // HANDLING TABS
  const [activeChat, setActiveChat] = useState(null);

  const isChatActive = (chatId) => {
    return activeChat === chatId;
  };

  const handleChatClick = (chatId) => {
    navigate(`/chats/${chatId}`);
  };

  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/^\/chats\/(\d+)$/);
    if (match) {
      const chatId = parseInt(match[1], 10);
      setActiveChat(chatId);
    } else {
      setActiveChat(null);
    }
  }, [location.pathname]);

  return (
    <Card className="shadow-none rounded-none bg-background">
      <List>
        {chatsListItems.map(
          ({ id, name, lastMsg, lastRead, avatar, youLast }) => {
            return (
              <ListItem
                key={id}
                onClick={() => handleChatClick(id)}
                selected={isChatActive(id)}
                className={`hover:bg-secondary-4 active:bg-secondary-4 ${
                  activeChat === id ? "!bg-primary-4" : ""
                }`}
              >
                <ListItemPrefix>
                  <Avatar alt="" src={avatar} />
                </ListItemPrefix>
                <div className="space-y-1">
                  <Typography className="text-sm font-semibold text-text-1">
                    {name}
                  </Typography>
                  <Typography
                    className={`flex text-xs font-normal text-text-3 ${
                      lastRead ? "" : "font-medium text-text-1"
                    }`}
                  >
                    <PaperAirplaneIcon
                      className={`h-4 w-4 mx-1 ${youLast ? "rotate-180" : ""}`}
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
  );
};

export default CustomChatsList;
