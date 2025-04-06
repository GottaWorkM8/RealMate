import React, { useState, useRef } from "react";
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
import { compressProfileImage, generateGroupKeywords } from "utils";
import { useNavigate } from "react-router-dom";
import {
  getUserGroupChatKeywordSetsData,
  getUserProfileData,
  setGroupChat,
  getUserKeywordSetsData,
  getUserFriendKeywordSetsData,
} from "apis/firebase";
import CustomMembersList from "./CustomMembersList";

const CustomGroupChatsMenu = ({ chats }) => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // SEARCHING FOR CHATS
  const [foundChats, setFoundChats] = useState([]);

  const handleSearch = async (term) => {
    const groupChats = await getUserGroupChatKeywordSetsData(
      currentUser.uid,
      term
    );
    const matchedChats = [];
    for (const groupChat of groupChats) {
      const userChat = chats.find((chat) => chat.id === groupChat.id);
      if (userChat) matchedChats.push(userChat);
    }
    setFoundChats(matchedChats);
  };

  // HANDLING SEARCH RESULT CLICK
  const handleResultClick = (chatId) => {
    navigate(`/chats/${chatId}`);
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
  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState(false);

  const validateGroupName = (name) => {
    const hasValidCharacters = /^[a-zA-ZĄąĆćĘęŁłŃńÓóŚśŹźŻż0-9\s]+$/;
    const error = name.length < 1 || !hasValidCharacters.test(name);
    setGroupNameError(error);
    return !error;
  };

  // UPLOADING NEW GROUP CHAT IMAGE
  const [groupAvatar, setGroupAvatar] = useState(null);

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

  // HANDLE ADDING MEMBERS
  const [addedMembers, setAddedMembers] = useState([]);

  const handleMemberResultClick = (userId) => {
    const userAdded = addedMembers.some((member) => member.id === userId);
    if (!userAdded) {
      const member = foundUsers.find((user) => user.id === userId);
      if (member) setAddedMembers((members) => [...members, member]);
    }
  };
  const handleAddedMemberClick = (userId) => {
    setAddedMembers((members) =>
      members.filter((member) => member.id !== userId)
    );
  };

  // HANDLING DIALOG
  const [chatDialogOpen, setChatDialogOpen] = useState(false);

  const handleChatDialogOpen = () => {
    setChatDialogOpen(!chatDialogOpen);
  };
  const handleChatDialogCancel = async () => {
    setGroupNameError(false);
    setGroupName("");
    setGroupAvatar(null);
    setAddedMembers([]);
    setChatDialogOpen(false);
  };
  const handleChatDialogConfirm = async () => {
    setLoading(true);
    const name = groupName;
    if (validateGroupName(name)) {
      const memberIds = addedMembers.map((member) => member.id);
      const keywords = generateGroupKeywords(name);
      const chatId = await setGroupChat(
        currentUser.uid,
        memberIds,
        name,
        groupAvatar,
        keywords
      );
      setChatDialogOpen(false);
      navigate(`/chats/${chatId}`);
    }
    setLoading(false);
  };

  // STATE OF THE BUTTON
  const [loading, setLoading] = useState(false);

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
          <DialogBody className="h-dialog p-6 pt-0 overflow-auto text-text-3">
            <div className="flex flex-col h-full gap-6">
              <div className="flex items-center gap-3">
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
                        : "https://firebasestorage.googleapis.com/v0/b/realmate-12bb1.appspot.com/o/avatars%2FgroupChats%2FgroupChat.png?alt=media&token=0d10023d-9d88-46db-b438-1d53606ae0f8"
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
                    <Typography className="text-sm font-semibold text-text-2 w-full">
                      Added members
                    </Typography>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform ${
                        accordionOpen && "rotate-180"
                      }`}
                    />
                  </AccordionHeader>
                  <AccordionBody className="flex flex-col py-1 px-3 gap-1">
                    {addedMembers.length ? (
                      <CustomMembersList
                        members={addedMembers}
                        onMemberClick={handleAddedMemberClick}
                      />
                    ) : (
                      <Typography className="text-sm font-light text-text-1">
                        None
                      </Typography>
                    )}
                  </AccordionBody>
                </Accordion>
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="space-x-2">
            <Button
              variant="text"
              color="blue-gray"
              onClick={handleChatDialogCancel}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              loading={loading}
              color="teal"
              onClick={handleChatDialogConfirm}
            >
              {loading ? "Loading" : "Confirm"}
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
