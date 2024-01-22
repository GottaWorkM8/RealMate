import { Input } from "@material-tailwind/react";
import React from "react";

const CustomInput = ({ placeholder, value, onChange, onBlur }) => {
  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e)}
      onBlur={onBlur}
      maxLength={50}
      color="teal"
      className="text-text-1 !border-secondary-2 placeholder:opacity-100 placeholder:text-text-4 focus:!border-primary-1"
      labelProps={{
        className: "hidden",
      }}
      containerProps={{
        className: "min-w-[10rem] h-10 bg-container rounded-lg",
      }}
    />
  );
};

export default CustomInput;
