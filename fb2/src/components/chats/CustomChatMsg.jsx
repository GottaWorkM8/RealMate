import { Typography } from "@material-tailwind/react";
import React, { useState } from "react";

const CustomChatMsg = ({ id, sender, content, sendDate, currentUserSender }) => {
  // HANDLE HOVERING
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
  };

  // HANDLE CLICKING
  const handleClick = (e) => {
    e.stopPropagation();
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={`flex ${currentUserSender && "justify-end"} gap-4`}>
        <Typography
          onClick={handleClick}
          className={`p-2 ${
            currentUserSender ? "rounded-s-md" : "rounded-e-md"
          } bg-secondary-4 ${
            hovered && "bg-secondary-3"
          } text-sm font-normal text-text-1 break-all`}
        >
          {content}
        </Typography>
      </div>
    </div>
  );
};

export default CustomChatMsg;
