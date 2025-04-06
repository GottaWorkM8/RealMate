import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  IconButton,
  Input,
  List,
  ListItem,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

const CustomNavbarSearchInput = ({
  placeholder,
  onSearch,
  userResults,
  groupResults,
  onUserResultClick,
  onGroupResultClick,
}) => {
  // HANDLING SEARCH
  const [term, setTerm] = useState("");
  const [searching, setSearching] = useState(false);

  const handleChange = (e) => {
    setTerm(e.target.value);
  };
  const search = async (term) => {
    setSearching(true);
    await onSearch(term);
    setSearching(false);
  };

  useEffect(() => {
    search(term);
  }, [term]);

  // OPENING AND CLOSING THE MENU
  const [menuOpen, setMenuOpen] = useState(false);

  // HANDLING RESULTS
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const handleUserClick = (userId) => {
    setTerm("");
    onUserResultClick(userId);
  };
  const handleGroupClick = (groupId) => {
    setTerm("");
    onGroupResultClick(groupId);
  };

  useEffect(() => {
    if (userResults) setUsers(userResults);
    if (groupResults) setGroups(groupResults);
  }, [userResults, groupResults]);

  useEffect(() => {
    setMenuOpen(term.length > 0);
  }, [term]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-1">
        <IconButton
          onClick={() => setTerm("")}
          className="h-10 shadow-none bg-transparent hover:bg-secondary-4"
          hidden={!term}
        >
          <ArrowLeftIcon className="h-6 w-6 text-text-1" />
        </IconButton>
        <Input
          type="text"
          placeholder={placeholder}
          maxLength={50}
          value={term}
          onChange={handleChange}
          color="teal"
          className="text-text-1 !border-secondary-2 placeholder:opacity-100 placeholder:text-text-4 focus:!border-primary-1"
          labelProps={{
            className: "hidden",
          }}
          containerProps={{
            className: "min-w-[10rem] h-10 bg-container rounded-lg",
          }}
          icon={<MagnifyingGlassIcon />}
        />
      </div>
      <div className="wrapper relative z-50" hidden={!menuOpen}>
        <div className="absolute top-3 left-0 right-0 py-1 border rounded-md bg-background">
          <div hidden={!users.length}>
            <Typography className="px-2 text-sm font-semibold text-text-2">
              Users
            </Typography>
            <List className="p-0">
              {users.map(({ id, displayName, avatarURL }) => {
                return (
                  <ListItem
                    key={id}
                    onClick={() => handleUserClick(id)}
                    className="flex items-center gap-4 py-2 pl-2 pr-8 hover:bg-secondary-4 focus:bg-secondary-4 active:bg-secondary-4"
                  >
                    <Avatar
                      size="sm"
                      alt=""
                      src={avatarURL}
                      className="border border-secondary-1 bg-avatar"
                    />
                    <div className="flex flex-col gap-1">
                      <Typography className="text-sm font-semibold text-text-1">
                        {displayName}
                      </Typography>
                    </div>
                  </ListItem>
                );
              })}
            </List>
          </div>
          <div hidden={!groups.length}>
            <Typography className="px-2 text-sm font-semibold text-text-2">
              Groups
            </Typography>
            <List className="p-0">
              {groups.map(({ id, displayName, avatarURL }) => {
                return (
                  <ListItem
                    key={id}
                    onClick={() => handleGroupClick(id)}
                    className="flex items-center gap-4 py-2 pl-2 pr-8 hover:bg-secondary-4 focus:bg-secondary-4 active:bg-secondary-4"
                  >
                    <Avatar
                      size="sm"
                      alt=""
                      src={avatarURL}
                      className="border border-secondary-1 bg-avatar"
                    />
                    <div className="flex flex-col gap-1">
                      <Typography className="text-sm font-semibold text-text-1">
                        {displayName}
                      </Typography>
                    </div>
                  </ListItem>
                );
              })}
            </List>
          </div>
          <div className="flex justify-center">
            <ArrowPathIcon
              className={`${
                searching ? "" : "hidden"
              } h-7 w-7 text-text-1 animate-spin`}
            />
            <Typography
              className={`${
                !users.length && !groups.length && !searching ? "" : "hidden"
              } text-sm font-normal text-text-3`}
            >
              No results found
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomNavbarSearchInput;
