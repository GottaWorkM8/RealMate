import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@material-tailwind/react";
import CustomChat from "components/CustomChat";
import CustomChatsList from "components/CustomChatsList";
import React from "react";

const Chats = () => {
  return (
    <div className="wrapper flex bg-background">
      <div className="chats-panel flex flex-col w-1/4 border-r border-secondary-3">
        <div className="flex flex-col p-4 pb-2 gap-4">
          <h1 className="text-2xl text-text-1 font-bold">Chats</h1>
          <Input
            type="text"
            placeholder="Search for chats"
            maxLength={50}
            color="teal"
            className="!border-secondary-2 placeholder:text-text-4 focus:!border-primary-1"
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
          <CustomChatsList />
        </div>
      </div>
      <div className="w-3/4">
        <CustomChat />
      </div>
    </div>
  );
};

export default Chats;
