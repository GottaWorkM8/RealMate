import { ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
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
import CustomSearchInput from "components/inputs/CustomSearchInput";
import CustomGroups from "components/groups/CustomGroups";
import CustomGroupsMenu from "components/groups/CustomGroupsMenu";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import CustomInput from "components/inputs/CustomInput";
import {
  getGroupProfileData,
  getUserGroupKeywordSetsData,
  getUserGroupsData,
  getUserKeywordSetsData,
  getUserProfileData,
  setGroup,
} from "apis/firebase";
import CustomMembersList from "components/chats/CustomMembersList";
import { compressProfileImage, generateGroupKeywords } from "utils";

function Groups() {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  // FETCHING GROUPS
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    const userGroups = await getUserGroupsData(currentUser.uid);
    const matchedGroups = [];
    for (const userGroup of userGroups) {
      const group = await getGroupProfileData(userGroup.id);
      matchedGroups.push(group);
    }
    setGroups(matchedGroups);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // SEARCHING FOR GROUPS
  const [foundGroups, setFoundGroups] = useState([]);

  const handleSearch = async (term) => {
    const userGroups = await getUserGroupKeywordSetsData(currentUser.uid, term);
    const matchedGroups = [];
    for (const userGroup of userGroups) {
      const group = groups.find((user) => user.id === userGroup.id);
      if (group) matchedGroups.push(group);
    }
    setFoundGroups(matchedGroups);
  };

  // HANDLE SEARCH RESULT CLICK
  const handleResultClick = (groupId) => {
    const userGroup = foundGroups.find((group) => group.id === groupId);
    if (userGroup) navigate(`/profile/group/${userGroup.id}`);
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

  // DESCRIPTION
  const [description, setDescription] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setDescription(e.target.value + "\n");
    }
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
    const users = await getUserKeywordSetsData(term);
    const matchedUsers = [];
    for (const user of users) {
      const userProfile = await getUserProfileData(user.id);
      if (userProfile) matchedUsers.push(userProfile);
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
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);

  const handleGroupDialogOpen = () => {
    setGroupDialogOpen(!groupDialogOpen);
  };
  const handleGroupDialogCancel = async () => {
    setGroupNameError(false);
    setGroupName("");
    setGroupAvatar(null);
    setAddedMembers([]);
    setGroupDialogOpen(false);
  };
  const handleGroupDialogConfirm = async () => {
    setLoading(true);
    const name = groupName;
    const desc = description;
    if (validateGroupName(name)) {
      const memberIds = addedMembers.map((member) => member.id);
      const keywords = generateGroupKeywords(name);
      const groupId = await setGroup(
        currentUser.uid,
        memberIds,
        name,
        groupAvatar,
        desc,
        keywords
      );
      setGroupDialogOpen(false);
      navigate(`/profile/group/${groupId}`);
    }
    setLoading(false);
  };

  // STATE OF THE BUTTON
  const [loading, setLoading] = useState(false);

  return (
    <div className="wrapper flex">
      <div className="h-panel flex flex-col w-1/4 border-r border-secondary-3">
        <div className="flex flex-col p-4 pb-2 gap-2">
          <div className="flex justify-between">
            <h1 className="text-2xl text-text-1 font-bold">Groups</h1>
            <Tooltip
              content="Create new group"
              placement="left"
              className="bg-tooltip/90"
            >
              <IconButton
                onClick={handleGroupDialogOpen}
                className={`rounded-full shadow-none bg-transparent hover:bg-secondary-1/40 text-text-2 ${
                  groupDialogOpen &&
                  "bg-primary-1/20 hover:bg-primary-1/30 text-primary-1"
                }`}
              >
                <PlusCircleIcon className="h-6 w-6" />
              </IconButton>
            </Tooltip>
            <Dialog
              open={groupDialogOpen}
              handler={handleGroupDialogOpen}
              className="bg-background"
            >
              <DialogHeader className="text-text-2">
                Create new group
              </DialogHeader>
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
                        className={`absolute mb-3 ${
                          !groupNameError && "hidden"
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
                  <div className="flex flex-col">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Description"
                      rows={3}
                      maxLength={1000}
                      className="peer h-full min-h-full w-full min-w-[200px] resize-none rounded-lg border bg-container px-3 py-2.5 pr-12 font-sans text-sm font-normal  outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50 placeholder:text-text-4 text-text-1 !border-secondary-2 focus:!border-primary-1"
                    />
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
                  onClick={handleGroupDialogCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="gradient"
                  loading={loading}
                  color="teal"
                  onClick={handleGroupDialogConfirm}
                >
                  {loading ? "Loading" : "Confirm"}
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
          <CustomSearchInput
            placeholder="Search for groups"
            onSearch={handleSearch}
            results={foundGroups}
            onResultClick={handleResultClick}
          />
        </div>
        <div className="overflow-auto">
          <CustomGroupsMenu />
        </div>
      </div>
      <div className="w-3/4 bg-container">
        <CustomGroups />
      </div>
    </div>
  );
}

export default Groups;
