import CustomHomeChats from "components/home/CustomHomeChats";
import CustomHomeFriendsGroups from "components/home/CustomHomeFriendsGroups";
import CustomHomePosts from "components/home/CustomHomePosts";
import React from "react";

function Home() {
  return (
    <div className="wrapper flex bg-container">
      <div className="h-panel flex flex-col w-1/4 border-r border-secondary-3">
        <CustomHomeFriendsGroups />
      </div>
      <div className="h-panel flex flex-col w-1/2">
        <CustomHomePosts />
      </div>
      <div className="h-panel flex flex-col w-1/4 border-l border-secondary-3">
        <CustomHomeChats />
      </div>
    </div>
  );
}

export default Home;
