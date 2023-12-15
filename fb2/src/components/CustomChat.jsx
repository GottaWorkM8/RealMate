import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { CursorArrowRippleIcon } from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CustomChat = () => {
  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  const [activeChat, setActiveChat] = useState(null);

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
    <div className="wrapper flex w-full h-full">
      {activeChat === null ? (
        <div className="flex flex-col w-full h-full items-center justify-center">
          <ChatBubbleOvalLeftEllipsisIcon className="h-44 w-44 text-primary-2"></ChatBubbleOvalLeftEllipsisIcon>
          <CursorArrowRippleIcon className="h-36 w-36 -mt-24 ml-20 text-text-2" />
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-bold text-text-2"
          >
            No chat selected
          </Typography>
        </div>
      ) : (
        <>
          <div className="chats-panel flex flex-col w-2/3">Mid</div>
          <div className="chats-panel flex flex-col w-1/3 border-l border-secondary-3">
            Right
          </div>
        </>
      )}
    </div>
  );
};

export default CustomChat;
