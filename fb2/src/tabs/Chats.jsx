import { ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Typography,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Tooltip,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  AccordionHeader,
  Accordion,
  AccordionBody,
} from "@material-tailwind/react";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../api/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "contexts/AuthContext";
import CustomChat from "../components/chats/CustomChat";
import CustomSearchInput from "components/CustomSearchInput";
import CustomInput from "components/CustomInput";
import CustomChatsList from "components/chats/CustomChatsList";
import CustomGroupChatsList from "components/chats/CustomGroupChatsList";
import { compressImage } from "utils";

const Chats = () => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const location = useLocation();

  // FETCHING CHATS
  const [chatsList, setChatsList] = useState([]);
  const [groupChatsList, setGroupChatsList] = useState([]);

  const fetchChats = async () => {
    if (currentUser) {
      const currentUserId = currentUser.uid;
      const chatsQuery = query(
        collection(db, "chats"),
        where("members.memberId", "==", currentUserId)
      );
      const chatsSnapshot = await getDocs(chatsQuery);
      const chatsData = [];
      for (const docum of chatsSnapshot.docs) {
        const chatData = docum.data();
        const userIndex = chatData.members.findIndex(
          (member) => member.memberId === currentUserId
        );
        const partnerIndex = userIndex === 0 ? 1 : 0;
        const partnerId = chatData.members[partnerIndex].memberId;
        const partnerSnapshot = await getDoc(doc(db, "users", partnerId));
        const partner = partnerSnapshot.exists ? partnerSnapshot.data() : null;
        if (partner) {
          chatsData.push({
            id: docum.id,
            docRef: docum.ref,
            avatarURL: partner.avatarURL,
            displayName: partner.displayName,
            members: chatData.members,
            userIndex: userIndex,
            partnerIndex: partnerIndex,
            creationDate: chatData.creationDate,
            lastMsg: chatData.lastMsg,
          });
        }
      }
      setChatsList(chatsData);
    }
  };

  const fetchGroupChats = async () => {
    if (currentUser) {
      const currentUserId = currentUser.uid;
      const chatsQuery = query(
        collection(db, "groupChats"),
        where("members.memberId", "==", currentUserId)
      );
      const chatsSnapshot = await getDocs(chatsQuery);
      const chatsData = [];
      for (const docum of chatsSnapshot.docs) {
        const chatData = docum.data();
        const userIndex = chatData.members.findIndex(
          (member) => member.memberId === currentUserId
        );
        chatsData.push({
          id: docum.id,
          docRef: docum.ref,
          avatarURL: chatData.avatarURL,
          displayName: chatData.displayName,
          members: chatData.members,
          userIndex: userIndex,
          creationDate: chatData.creationDate,
          lastMsg: chatData.lastMsg,
        });
      }
      setGroupChatsList(chatsData);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchGroupChats();
  }, []);

  // SEARCHING FOR CHATS
  const [searchedChats, setSearchedChats] = useState([]);
  const [searchedGroupChats, setSearchedGroupChats] = useState([]);

  const handleSearch = async (term) => {
    const lcTerm = term.toLowerCase();
    const filteredChats = chatsList.filter((chat) =>
      chat.displayName.toLowerCase().includes(lcTerm)
    );
    const filteredGroupChats = chatsList.filter((groupChat) =>
      groupChat.displayName.toLowerCase().includes(lcTerm)
    );
    setSearchedChats(filteredChats);
    setSearchedGroupChats(filteredGroupChats);
  };

  // HANDLING CHATS
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatAvatarURL, setActiveChatAvatarURL] = useState(null);
  const [activeChatDisplayName, setActiveChatDisplayName] = useState(null);
  const [activeChatDocRef, setActiveChatDocRef] = useState(null);

  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/^\/chats\/(.+)$/);
    if (match) {
      const chatId = match[1];
      const chat = chatsList.find((item) => item.id === chatId);
      if (chat) {
        setActiveChatId(chatId);
        setActiveChatAvatarURL(chat.avatarURL);
        setActiveChatDisplayName(chat.displayName);
        setActiveChatDocRef(chat.docRef);
        return;
      }
    }
    setActiveChatId(null);
    setActiveChatAvatarURL(null);
    setActiveChatDisplayName(null);
    setActiveChatDocRef(null);
  }, []);

  // ADDING NEW CHAT
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState(false);
  const [groupAvatar, setGroupAvatar] = useState(null);

  const handleChatDialogOpen = () => {
    setChatDialogOpen(!chatDialogOpen);
  };
  const handleChatDialogConfirm = () => {
    setChatDialogOpen(false);
  };

  // HANDLING NEW CHAT ACCORDION
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [addedMembers, setAddedMembers] = useState([]);

  const handleAccordionOpen = () => {
    setAccordionOpen(!accordionOpen);
  };

  // ACCORDION ANIMATION
  const customAnimation = {
    mount: { scale: 1 },
    unmount: { scale: 0.95 },
  };

  // FUNCTIONS FOR INPUT VALIDATION
  const validateGroupName = (name) => {
    const hasValidCharacters = /^[a-zA-ZĄąĆćĘęŁłŃńÓóŚśŹźŻż0-9\s]+$/;
    const error = name.length < 1 || !hasValidCharacters.test(name);

    setGroupNameError(error);
    return !error;
  };

  // UPLOADING NEW GROUP CHAT IMAGE
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressedFile = await compressImage(file);
    setGroupAvatar(compressedFile);
    e.target.value = null;
    console.log("File uploaded:", file.name);
  };

  // SEARCHING FOR NEW CHAT MEMBERS
  const [searchedUsers, setSearchedUsers] = useState([]);

  const handleUserSearch = async (term) => {
    const lcTerm = term.toLowerCase();
    if (lcTerm.length > 0) {
      // Search for users by keywords
      const usersQuery = query(
        collection(db, "users"),
        where("keywords", "array-contains", lcTerm),
        limit(3)
      );
      const usersSnapshot = await getDocs(usersQuery);
      const users = usersSnapshot.docs.map((doc) => doc.data());
      setSearchedUsers(users);
    } else {
      setSearchedUsers([]);
    }
  };

  useEffect(() => {
    console.log("Searched users: " + searchedUsers.length);
  }, [searchedUsers]);

  return (
    <div className="wrapper flex">
      <div className="h-panel flex flex-col w-1/4 border-r border-secondary-3">
        <div className="flex flex-col px-4 py-2 gap-2">
          <div className="flex justify-between">
            <h1 className="mt-2 text-2xl text-text-1 font-bold">Chats</h1>
            <Tooltip
              content="Create new chat"
              placement="left"
              className="bg-tooltip/80"
            >
              <IconButton
                size="lg"
                onClick={handleChatDialogOpen}
                className={`rounded-full ${
                  chatDialogOpen
                    ? "bg-primary-1/20 hover:bg-primary-1/30 text-primary-1"
                    : "bg-secondary-1/40 hover:bg-secondary-1/60 text-text-2"
                }`}
              >
                <PlusCircleIcon className="h-7 w-7" />
              </IconButton>
            </Tooltip>
            <Dialog
              open={chatDialogOpen}
              handler={handleChatDialogOpen}
              className="bg-background"
            >
              <DialogHeader className="text-text-2">
                Create new chat
              </DialogHeader>
              <DialogBody className="h-dialog overflow-auto text-text-3">
                <div className="flex flex-col p-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <CustomSearchInput
                      placeholder="Search for members"
                      onSearch={handleUserSearch}
                      results={searchedUsers}
                    />
                    <Accordion open={accordionOpen} animate={customAnimation}>
                      <AccordionHeader
                        onClick={handleAccordionOpen}
                        className="flex rounded-md p-2 border-0 text-sm font-semibold text-text-2 hover:text-text-2 hover:bg-secondary-4"
                      >
                        <div className="flex w-full items-center">
                          Added members
                        </div>
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform ${
                            accordionOpen ? "rotate-180" : ""
                          }`}
                        />
                      </AccordionHeader>
                      <AccordionBody className="py-1 px-3 gap-1">
                        {addedMembers.at[0] ? "" : "None"}
                      </AccordionBody>
                    </Accordion>
                  </div>
                  <div className="flex w-full items-center gap-3">
                    <div className="flex-1 flex-col">
                      <CustomInput
                        placeholder="Group chat name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        onBlur={() => validateGroupName(groupName)}
                      />
                      <Typography
                        variant="small"
                        color="red"
                        className={`absolute mb-3 ${
                          groupNameError ? "" : "hidden"
                        }`}
                      >
                        Use at least one letter or digit, no special characters.
                      </Typography>
                    </div>
                    <div className="flex justify-center items-center gap-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        hidden
                      />
                      <Avatar
                        size="xxl"
                        alt=""
                        src={
                          groupAvatar
                            ? URL.createObjectURL(groupAvatar)
                            : "https://firebasestorage.googleapis.com/v0/b/realmate-12bb1.appspot.com/o/avatars%2Fgroup.png?alt=media&token=9d4f32df-8837-4a2a-af45-de7b08614d56"
                        }
                        className="border border-secondary-1 bg-avatar"
                      />
                      <IconButton
                        onClick={handleFileClick}
                        className="shadow-none rounded-full bg-transparent hover:bg-secondary-1/40 text-text-2 hover:text-text-1"
                      >
                        <PlusCircleIcon className="h-6 w-6" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </DialogBody>
              <DialogFooter className="space-x-2">
                <Button
                  variant="text"
                  color="blue-gray"
                  onClick={handleChatDialogOpen}
                >
                  Cancel
                </Button>
                <Button
                  variant="gradient"
                  color="teal"
                  onClick={handleChatDialogConfirm}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
          <CustomSearchInput
            placeholder="Search for chats"
            onSearch={handleSearch}
          />
        </div>
        <div className="overflow-auto">
          <Tabs value={0}>
            <TabsHeader
              className="p-2 bg-transparent"
              indicatorProps={{
                className: "bg-secondary-4",
              }}
            >
              <Tab
                key={0}
                value={0}
                className="p-1 rounded-md text-base font-semibold text-primary-1"
              >
                Private
              </Tab>
              <Tab
                key={1}
                value={1}
                className="p-1 rounded-md text-base font-semibold text-primary-1"
              >
                Group
              </Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel key={0} value={0}>
                <CustomChatsList
                  chatsList={chatsList}
                  activeChatId={activeChatId}
                />
              </TabPanel>
              <TabPanel key={1} value={1}>
                <CustomGroupChatsList
                  groupChatsList={groupChatsList}
                  activeChatId={activeChatId}
                />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
      <div className="w-3/4">
        <CustomChat
          chatAvatarURL={activeChatAvatarURL}
          chatDisplayName={activeChatDisplayName}
          chatDocRef={activeChatDocRef}
        />
      </div>
    </div>
  );
};

export default Chats;
