import React, { useState } from "react";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import CustomGroupAbout from "./CustomGroupAbout";
import CustomGroupImages from "./CustomGroupImages";
import CustomGroupVideos from "./CustomGroupVideos";
import CustomGroupLinks from "./CustomGroupLinks";
import CustomGroupMembers from "./CustomGroupMembers";
import CustomGroupPosts from "./CustomGroupPosts";

const CustomGroupProfileTabs = () => {
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
            Members
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
          <TabPanel key={0} value={0}>
            <CustomGroupAbout />
          </TabPanel>
          <TabPanel key={1} value={1}>
            <CustomGroupMembers />
          </TabPanel>
          <TabPanel key={2} value={2}>
            <CustomGroupPosts />
          </TabPanel>
          <TabPanel key={3} value={3}>
            <CustomGroupImages />
          </TabPanel>
          <TabPanel key={4} value={4}>
            <CustomGroupVideos />
          </TabPanel>
          <TabPanel key={5} value={5}>
            <CustomGroupLinks />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default CustomGroupProfileTabs;
