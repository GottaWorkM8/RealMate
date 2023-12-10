import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@material-tailwind/react";
import React from "react";

const Chats = () => {
  return (
    <div className="wrapper flex">
      <div className="flex flex-col w-1/4 p-3 gap-2">
        <h1 className="text-2xl text-text1 font-medium">Chats</h1>
        <Input
          type="text"
          placeholder="Search for chat"
          maxLength={50}
          color="teal"
          className="!border-text5 placeholder:text-text4 focus:!border-primary1"
          labelProps={{
            className: "hidden",
          }}
          containerProps={{
            className:
              "min-w-[100px] max-w-[15rem] h-8 bg-secondary3 rounded-lg",
          }}
          icon={<MagnifyingGlassIcon />}
          crossOrigin={undefined}
        />
      </div>
      <div className="flex w-1/2">Second</div>
      <div className="flex w-1/4">Third</div>
    </div>
  );
};

export default Chats;
