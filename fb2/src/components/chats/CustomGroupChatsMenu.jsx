import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Typography,
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
import { useAuth } from "contexts/AuthContext";
import { ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import CustomSearchInput from "components/inputs/CustomSearchInput";
import CustomInput from "components/inputs/CustomInput";
import { compressProfileImage } from "utils";
import { useNavigate } from "react-router-dom";
import CustomChatMember from "./CustomChatMember";
import {
  getUserGroupChatKeywordSetsData,
  getUserFriendKeywordSetsData,
  getUserProfileData,
} from "apis/firebase";

const CustomGroupChatsMenu = ({ chats }) => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // SETTING CHATS
  const [userChats, setUserChats] = useState([]);

  useEffect(() => {
    if (chats) setUserChats(chats);
  }, [chats]);

  // SEARCHING FOR CHATS
  const [foundChats, setFoundChats] = useState([]);

  const handleSearch = async (term) => {
    const groupChats = await getUserGroupChatKeywordSetsData(
      currentUser.uid,
      term
    );
    const matchedChats = [];
    for (const groupChat of groupChats) {
      const userChat = userChats.find((chat) => chat.id === groupChat.id);
      if (userChat) matchedChats.push(userChat);
    }
    setFoundChats(matchedChats);
  };

  // HANDLING SEARCH RESULT CLICK
  const handleResultClick = (chatId) => {
    navigate(`/chats/${chatId}`);
  };

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
    const compressedFile = await compressProfileImage(file);
    setGroupAvatar(compressedFile);
    e.target.value = null;
    console.log("File uploaded:", file.name);
  };

  // SEARCHING FOR NEW CHAT MEMBERS
  const [foundUsers, setFoundUsers] = useState([]);

  const handleUserSearch = async (term) => {
    const friends = await getUserFriendKeywordSetsData(currentUser.uid, term);
    const matchedUsers = [];
    for (const friend of friends) {
      const user = await getUserProfileData(friend.id);
      if (user) matchedUsers.push(user);
    }
    setFoundUsers(matchedUsers);
  };

  // HANDLE NEW CHAT MEMBER SEARCH RESULT CLICK
  const [addedMembers, setAddedMembers] = useState([]);

  const handleMemberResultClick = (userId) => {
    const member = foundUsers.find((user) => user.id === userId);
    if (member) setAddedMembers((members) => [...members, member]);
  };

  return (
    <div className="flex flex-col p-4 pb-2 gap-2">
      <div className="flex justify-between">
        <h1 className="text-2xl text-text-1 font-bold">Group Chats</h1>
        <Tooltip
          content="Create new chat"
          placement="left"
          className="bg-tooltip/90"
        >
          <IconButton
            onClick={handleChatDialogOpen}
            className={`rounded-full shadow-none bg-transparent hover:bg-secondary-1/40 text-text-2
            ${
              chatDialogOpen &&
              "bg-primary-1/20 hover:bg-primary-1/30 text-primary-1"
            }`}
          >
            <PlusCircleIcon className="h-6 w-6" />
          </IconButton>
        </Tooltip>
        <Dialog
          open={chatDialogOpen}
          handler={handleChatDialogOpen}
          className="bg-background"
        >
          <DialogHeader className="text-text-2">Create new chat</DialogHeader>
          <DialogBody className="h-dialog overflow-auto text-text-3">
            <div className="flex flex-col p-2 gap-6">
              <div className="flex flex-col gap-3">
                <CustomSearchInput
                  placeholder="Search for members"
                  onSearch={handleUserSearch}
                  results={foundUsers}
                  onResultClick={handleMemberResultClick}
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
                        accordionOpen && "rotate-180"
                      }`}
                    />
                  </AccordionHeader>
                  <AccordionBody className="py-1 px-3 gap-1">
                    {addedMembers.length > 0 ? "" : "None"}
                    {addedMembers.map(({ id, displayName, avatarURL }) => {
                      return (
                        <CustomChatMember
                          id={id}
                          displayName={displayName}
                          avatarURL={avatarURL}
                        />
                      );
                    })}
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
                    className={`absolute mb-3 ${!groupNameError && "hidden"}`}
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
                    className="shadow-none rounded-full bg-transparent hover:bg-secondary-1/40 text-text-2"
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
        results={foundChats}
        onResultClick={handleResultClick}
      />
    </div>
  );
};

export default CustomGroupChatsMenu;
