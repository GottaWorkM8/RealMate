import { Card, CardBody, Typography } from "@material-tailwind/react";
import React, { useState } from "react";

const CustomChatMsg = ({ msg }) => {
  const [hovered, setHovered] = useState(false);
  const handleMouseEnter = () => {
    setHovered(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <Card
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="shadow-none bg-background"
    >
      <CardBody className="flex mx-2 p-2 gap-4">
        <Typography
          className={`rounded-md p-2 bg-secondary-4 ${
            hovered ? "bg-secondary-3" : ""
          } text-sm font-normal text-text-1 break-all`}
        >
          {msg}
        </Typography>
      </CardBody>
    </Card>
  );
};

export default CustomChatMsg;
