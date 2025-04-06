import React, { useState } from "react";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import CustomUserAbout from "./CustomUserAbout";
import CustomUserImages from "./CustomUserImages";
import CustomUserVideos from "./CustomUserVideos";
import CustomUserLinks from "./CustomUserLinks";
import CustomUserFriends from "./CustomUserFriends";
import CustomUserPosts from "./CustomUserPosts";

const CustomUserProfileTabs = () => {
  // HANDLING TABS
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="px-9 text-text-1">
      <Tabs value={activeTab}>
        <TabsHeader
          className="p-2 bg-transparent"
          indicatorProps={{
            className: "bg-secondary-4",
          }}
        >
          <Tab
            key={0}
            value={0}
            onClick={() => setActiveTab(0)}
            className="p-1 rounded-md text-base font-semibold text-primary-1"
          >
            About
          </Tab>
          <Tab
            key={1}
            value={1}
            onClick={() => setActiveTab(1)}
            className="p-1 rounded-md text-base font-semibold text-primary-1"
          >
            Friends
          </Tab>
          <Tab
            key={2}
            value={2}
            onClick={() => setActiveTab(2)}
            className="p-1 rounded-md text-base font-semibold text-primary-1"
          >
            Posts
          </Tab>
          <Tab
            key={3}
            value={3}
            onClick={() => setActiveTab(3)}
            className="p-1 rounded-md text-base font-semibold text-primary-1"
          >
            Images
          </Tab>
          <Tab
            key={4}
            value={4}
            onClick={() => setActiveTab(4)}
            className="p-1 rounded-md text-base font-semibold text-primary-1"
          >
            Videos
          </Tab>
          <Tab
            key={5}
            value={5}
            onClick={() => setActiveTab(5)}
            className="p-1 rounded-md text-base font-semibold text-primary-1"
          >
            Links
          </Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel key={0} value={0} className="p-2">
            <CustomUserAbout />
          </TabPanel>
          <TabPanel key={1} value={1} className="p-2">
            <CustomUserFriends />
          </TabPanel>
          <TabPanel key={2} value={2} className="p-2">
            <CustomUserPosts />
          </TabPanel>
          <TabPanel key={3} value={3} className="p-2">
            <CustomUserImages />
          </TabPanel>
          <TabPanel key={4} value={4} className="p-2">
            <CustomUserVideos />
          </TabPanel>
          <TabPanel key={5} value={5} className="p-2">
            <CustomUserLinks />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default CustomUserProfileTabs;
