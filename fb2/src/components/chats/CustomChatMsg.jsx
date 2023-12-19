import { Avatar, Card, CardBody, Typography } from "@material-tailwind/react";
import React, { useState } from "react";
import PropTypes from "prop-types";

const CustomChatMsg = (props) => {
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
      <CardBody
        className={`flex mx-2 p-2 gap-4 ${props.avatar ? "" : "justify-end"}`}
      >
        {props.avatar && (
          <Avatar
            size="sm"
            alt=""
            src={props.avatar}
            className="border border-secondary-1 bg-avatar"
          />
        )}
        <Typography
          className={`rounded-md ${
            props.avatar
              ? "mr-16 sm:mr-20 md:mr-24 lg:mr-28 xl:mr-32"
              : "ml-16 sm:ml-20 md:ml-24 lg:ml-28 xl:ml-32"
          } p-2 bg-secondary-4 ${
            hovered ? "bg-secondary-3" : ""
          } text-sm font-normal text-text-1 break-all`}
        >
          {props.msg}
        </Typography>
      </CardBody>
    </Card>
  );
};

CustomChatMsg.propTypes = {
  avatar: PropTypes.string,
  msg: PropTypes.string.isRequired,
};

export default CustomChatMsg;
