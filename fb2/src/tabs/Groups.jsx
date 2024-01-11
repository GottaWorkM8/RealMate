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
import CustomSearchInput from "components/CustomSearchInput";
import CustomGroups from "components/groups/CustomGroups";
import CustomGroupsMenu from "components/groups/CustomGroupsMenu";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../api/firebase";
import { useAuth } from "contexts/AuthContext";
import CustomInput from "components/CustomInput";

function Groups() {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const location = useLocation();

  // FETCHING groupS
  const [groupsList, setGroupsList] = useState([]);

  const fetchGroups = async () => {
    if (currentUser) {
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // SEARCHING FOR GROUPS
  const [searchedGroups, setSearchedGroups] = useState([]);

  const handleSearch = async (term) => {
    const lcTerm = term.toLowerCase();
    const filteredGroups = groupsList.filter((group) =>
      group.displayName.toLowerCase().includes(lcTerm)
    );
    setSearchedGroups(filteredGroups);
  };

  // ADDING NEW group
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState(false);
  const [groupAvatar, setGroupAvatar] = useState(null);

  const handleGroupDialogOpen = () => {
    setGroupDialogOpen(!groupDialogOpen);
  };
  const handleGroupDialogConfirm = () => {
    setGroupDialogOpen(false);
  };

  // HANDLING NEW group ACCORDION
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

  // UPLOADING IMAGE
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGroupAvatar(file);
    e.target.value = null;
    console.log("File uploaded:", file.name);
  };

  return (
    <div className="wrapper flex">
      <div className="h-panel flex flex-col w-1/4 border-r border-secondary-3">
        <div className="flex flex-col px-4 py-2 gap-2">
          <div className="flex justify-between">
            <h1 className="mt-2 text-2xl text-text-1 font-bold">Groups</h1>
            <Tooltip
              content="Create new group"
              placement="left"
              className="bg-tooltip/80"
            >
              <IconButton
                size="lg"
                onClick={handleGroupDialogOpen}
                className={`rounded-full ${
                  groupDialogOpen
                    ? "bg-primary-1/20 hover:bg-primary-1/30 text-primary-1"
                    : "bg-secondary-1/40 hover:bg-secondary-1/60 text-text-2"
                }`}
              >
                <PlusCircleIcon className="h-7 w-7" />
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
              <DialogBody className="h-dialog overflow-auto text-text-3">
                <div className="flex flex-col p-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <CustomSearchInput
                      placeholder="Search for members"
                      onSearch={handleSearch}
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
                        placeholder="Group name"
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
                  onClick={handleGroupDialogOpen}
                >
                  Cancel
                </Button>
                <Button
                  variant="gradient"
                  color="teal"
                  onClick={handleGroupDialogConfirm}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
          <CustomSearchInput
            placeholder="Search for groups"
            onSearch={handleSearch}
          />
        </div>
        <div className="overflow-auto">
          <CustomGroupsMenu />
        </div>
      </div>
      <div className="w-3/4">
        <CustomGroups />
      </div>
    </div>
  );
}

export default Groups;
