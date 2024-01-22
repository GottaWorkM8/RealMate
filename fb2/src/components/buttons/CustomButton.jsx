import { Button } from "@material-tailwind/react";
import React from "react";

const CustomButton = ({ icon, text, colored, onClick }) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={`flex h-10 px-4 gap-1 items-center rounded-md ${
        colored
          ? "bg-primary-1 hover:bg-primary-1/80 text-white"
          : "bg-secondary-1/40 hover:bg-secondary-1/60 text-text-2"
      }`}
    >
      {icon}
      {text}
    </Button>
  );
};

export default CustomButton;
