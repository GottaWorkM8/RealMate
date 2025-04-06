import {
  ChevronDownIcon,
  FaceSmileIcon,
  GifIcon,
  PaperAirplaneIcon,
  PhotoIcon as PhotoIconSolid,
} from "@heroicons/react/24/solid";
import {
  BellAlertIcon,
  DocumentTextIcon,
  FlagIcon,
  LinkIcon,
  NoSymbolIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Avatar,
  Card,
  CardBody,
  IconButton,
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import GifPicker from "gif-picker-react";
import { useAuth } from "contexts/AuthContext";
import CustomChatMsgGroup from "./CustomChatMsgGroup";
import {
  db,
  getUserProfileData,
  setChatMessage,
  updateUserChatLastActive,
} from "apis/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import LoadIndicator from "components/indicators/LoadIndicator";

const CustomChat = ({ chat }) => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();

  // SENDING MESSAGES
  const [text, setText] = useState("");

  const handleText = (e) => {
    setText(e.target.value);
  };
  const sendMessage = async () => {
    if (text.trim() === "") return;
    const content = text;
    setText("");
    await setChatMessage(chat.id, currentUser.uid, content);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        setText(e.target.value + "\n");
      } else sendMessage();
    }
  };
  const handleSendClick = () => {
    sendMessage();
  };

  // FETCHING MESSAGES
  const [messageGroups, setMessageGroups] = useState([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  const enrichMessageGroup = async (messageGroup) => {
    const message = messageGroup[0];
    const user = await getUserProfileData(message.sender);
    const sendDate = message.sendDate.toDate();
    const id = user.id + sendDate.toISOString();

    return {
      id: id,
      messages: messageGroup,
      sender: user.id,
      senderAvatarURL: user.avatarURL,
      senderDisplayName: user.displayName,
      sendDate: sendDate,
    };
  };

  const groupMessages = async (messages) => {
    const maxTimeDiffMins = 5;
    let currentGroup = [messages[0]];
    const enrichMessageGroupPromises = [];

    for (let i = 1; i < messages.length; i++) {
      const lastMessageIndex = currentGroup.length - 1;
      const timeDiffSecs =
        messages[i].sendDate - currentGroup[lastMessageIndex].sendDate;
      const timeDiffMins = timeDiffSecs / 60;
      if (
        timeDiffMins > maxTimeDiffMins ||
        messages[i].sender !== currentGroup[lastMessageIndex].sender
      ) {
        enrichMessageGroupPromises.push(enrichMessageGroup(currentGroup));
        currentGroup = [messages[i]];
      } else {
        currentGroup.push(messages[i]);
      }
    }

    enrichMessageGroupPromises.push(enrichMessageGroup(currentGroup));
    const enrichedGroups = await Promise.all(enrichMessageGroupPromises);

    return enrichedGroups;
  };

  const addFirstGroupMessage = async (message) => {
    const newGroup = [message];
    const enrichedGroup = await enrichMessageGroup(newGroup);
    setMessageGroups((prevMessageGroups) => [
      ...prevMessageGroups,
      enrichedGroup,
    ]);
  };

  const addGroupedMessage = async (message) => {
    if (messageGroups.length) {
      const maxTimeDiffMins = 5;
      const lastGroupIndex = messageGroups.length - 1;
      const lastMessageIndex =
        messageGroups[lastGroupIndex].messages.length - 1;
      const lastMessage =
        messageGroups[lastGroupIndex].messages[lastMessageIndex];
      const timeDiffSecs = message.sendDate - lastMessage.sendDate;
      const timeDiffMins = timeDiffSecs / 60;
      if (
        timeDiffMins > maxTimeDiffMins ||
        message.sender !== lastMessage.sender
      ) {
        addFirstGroupMessage(message);
      } else {
        setMessageGroups((prevMessageGroups) => {
          const updatedGroups = [...prevMessageGroups];
          updatedGroups[lastGroupIndex] = {
            ...updatedGroups[lastGroupIndex],
            messages: [...updatedGroups[lastGroupIndex].messages, message],
          };
          return updatedGroups;
        });
      }
    } else addFirstGroupMessage(message);
  };

  const removeGroupedMessage = async (messageId) => {
    setMessageGroups((prevMessageGroups) => {
      const updatedGroups = [];

      for (let i = prevMessageGroups.length - 1; i >= 0; i--) {
        const messageGroup = prevMessageGroups[i];
        const updatedMessages = [];

        for (let j = messageGroup.messages.length - 1; j >= 0; j--) {
          const message = messageGroup.messages[j];
          if (message.id !== messageId) updatedMessages.push(message);
        }

        if (updatedMessages.length > 0)
          updatedGroups.push({
            ...messageGroup,
            messages: updatedMessages.reverse(),
          });
      }

      return updatedGroups.reverse();
    });
  };

  const unsubscribeRef = useRef(null);

  useEffect(() => {
    const handleMessages = async () => {
      if (unsubscribeRef.current) {
        setMessagesLoaded(false);
        unsubscribeRef.current();
      }

      const messagesQuery = query(
        collection(db, "chats", chat.id, "messages"),
        orderBy("sendDate")
      );
      unsubscribeRef.current = onSnapshot(messagesQuery, async (snapshot) => {
        if (messagesLoaded) {
          const messageChanges = snapshot.docChanges();
          messageChanges.forEach((change) => {
            const message = change.doc.data();
            if (change.type === "added") addGroupedMessage(message);
            else if (change.type === "removed")
              removeGroupedMessage(message.id);
          });
        } else {
          const messages = snapshot.docs.map((docum) => docum.data());
          if (messages.length) {
            const groupedMessages = await groupMessages(messages);
            await setMessageGroups(groupedMessages);
          }
          setMessagesLoaded(true);
        }
        updateUserChatLastActive(currentUser.uid, chat.id);
      });
    };

    if (chat) handleMessages();

    return () => {
      if (unsubscribeRef.current) {
        setMessagesLoaded(false);
        unsubscribeRef.current();
      }
    };
  }, [chat]);

  // HANDLING CHAT SCROLLING
  const chatAreaRef = useRef(null);
  const [contentChanged, setContentChanged] = useState(false);

  useEffect(() => {
    const observerCallback = () => setContentChanged(true);
    const observer = new MutationObserver(observerCallback);

    if (chatAreaRef.current) {
      const observerConfig = { childList: true, subtree: true };
      observer.observe(chatAreaRef.current, observerConfig);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (contentChanged) {
      if (chatAreaRef.current)
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      setContentChanged(false);
    }
  }, [contentChanged]);

  // HANDLING PROFILE CLICK
  const handleShowProfileClick = () => {
    navigate(`/profile/user/${chat.partnerId}`);
  };

  // HANDLING ACTIVE CHAT ACCORDIONS
  const [openAccordion, setOpenAccordion] = React.useState(0);

  const handleOpenAccordion = (accordionId) => {
    setOpenAccordion(openAccordion === accordionId ? 0 : accordionId);
  };

  // ACCORDION ANIMATION
  const customAnimation = {
    mount: { scale: 1 },
    unmount: { scale: 0.95 },
  };

  // HANDLING ACTIVE CHAT INPUT
  const textareaRef = useRef(null);

  const handleChatAreaClick = () => {
    textareaRef.current.focus();
  };

  useEffect(() => {
    setText("");
    textareaRef.current.focus();
  }, [chat]);

  // UPLOADING MEDIA
  const filesInputRef = useRef(null);

  const handleFilesClick = () => {
    setGifsOpen(false);
    setEmojisOpen(false);
    filesInputRef.current.click();
  };
  const handleFilesChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setTimeout(() => {
      console.log("File uploaded:", file.name);
    }, 2000);
    console.log("file is", file);

    event.target.value = null;
    console.log(event.target.files);
    console.log(file);
    console.log(file.name);
  };

  // PICKING GIFS
  const [gifsOpen, setGifsOpen] = useState(false);

  const handleGifsClick = () => {
    setEmojisOpen(false);
    setGifsOpen(!gifsOpen);
  };
  const handleGifClick = (gif) => {
    setGifsOpen(false);
  };

  // PICKING EMOJIS
  const [emojisOpen, setEmojisOpen] = useState(false);

  const handleEmojisClick = () => {
    setGifsOpen(false);
    setEmojisOpen(!emojisOpen);
  };
  const handleEmojiClick = (emoji) => {
    setEmojisOpen(false);
    setText(textareaRef.current.value + emoji.emoji);
  };

  return (
    <div className="flex w-full h-full">
      <div className="h-panel flex flex-col w-2/3 text-text-1">
        <Card className="rounded-none bg-background">
          <CardBody className="flex items-center gap-4 p-3">
            <Avatar
              alt="avatar"
              src={chat.avatarURL}
              className="border border-secondary-1 bg-avatar"
            />
            <Typography className="text-base font-semibold text-text-1">
              {chat.displayName}
            </Typography>
          </CardBody>
        </Card>
        <div
          ref={chatAreaRef}
          onClick={handleChatAreaClick}
          className="w-full h-full p-2 overflow-auto"
        >
          {messagesLoaded ? (
            messageGroups.length ? (
              messageGroups.map(
                ({
                  id,
                  messages,
                  sender,
                  senderAvatarURL,
                  senderDisplayName,
                  sendDate,
                }) => {
                  return (
                    <CustomChatMsgGroup
                      key={id}
                      messages={messages}
                      sender={sender}
                      senderAvatarURL={senderAvatarURL}
                      senderDisplayName={senderDisplayName}
                      sendDate={sendDate}
                    />
                  );
                }
              )
            ) : (
              <div className="flex flex-col h-full p-2 justify-center gap-2 items-center text-sm font-normal text-text-1">
                <Typography>No messages to display</Typography>
                <Typography>Be the first to write!</Typography>
              </div>
            )
          ) : (
            <LoadIndicator />
          )}
        </div>
        <div className="flex w-full h-16 justify-center p-3 gap-2">
          <div className="flex gap-1">
            <input
              type="file"
              ref={filesInputRef}
              onChange={handleFilesChange}
              accept="image/*"
              hidden
            />
            <Tooltip content="Attach a file" className="bg-tooltip/90">
              <IconButton
                onClick={handleFilesClick}
                className="shadow-none rounded-full bg-transparent hover:bg-secondary-1/40 text-text-2 hover:text-text-1"
              >
                <PhotoIconSolid className="h-6 w-6" />
              </IconButton>
            </Tooltip>
            <div className="relative flex gap-1">
              <Tooltip content="Attach a gif" className="bg-tooltip/80 z-auto">
                <IconButton
                  onClick={handleGifsClick}
                  className="shadow-none rounded-full bg-transparent hover:bg-secondary-1/40 text-text-2 hover:text-text-1"
                >
                  <GifIcon className="h-6 w-6" />
                </IconButton>
              </Tooltip>
              <div
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
                hidden={!gifsOpen}
              >
                <GifPicker
                  tenorApiKey={"AIzaSyCw441pGntBTNbKuH5HE6tJTN8rnzkC3jE"}
                  onGifClick={handleGifClick}
                />
              </div>
            </div>
          </div>
          <div className="relative flex w-full">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleText}
              onKeyDown={handleKeyDown}
              placeholder="Message"
              rows={1}
              maxLength={1000}
              className="peer h-full min-h-full w-full min-w-[200px] resize-none rounded-lg border bg-container px-3 py-2.5 pr-12 font-sans text-sm font-normal  outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50 placeholder:text-text-4 text-text-1 !border-secondary-2 focus:!border-primary-1"
              style={{
                overflow: "hidden",
              }}
            />
            <IconButton
              disabled={!text}
              onClick={handleSendClick}
              className="!absolute right-0 shadow-none bg-transparent hover:bg-primary-1/30 text-primary-1 disabled:text-secondary-1"
            >
              <PaperAirplaneIcon
                className={`h-6 w-6 transition-transform ${
                  text ? "-rotate-90" : "rotate-90"
                }`}
              />
            </IconButton>
          </div>
          <div className="relative flex gap-1">
            <Tooltip content="Pick an emoji" className="bg-tooltip/80 z-auto">
              <IconButton
                onClick={handleEmojisClick}
                className="shadow-none rounded-full bg-transparent hover:bg-secondary-1/40 text-text-2 hover:text-text-1"
              >
                <FaceSmileIcon className="h-6 w-6" />
              </IconButton>
            </Tooltip>
            <div
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
              hidden={!emojisOpen}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                emojiStyle={EmojiStyle.FACEBOOK}
                skinTonesDisabled
                emojiVersion="5.0"
                lazyLoadEmojis
              />
            </div>
          </div>
        </div>
      </div>
      <div className="h-panel flex flex-col w-1/3 p-2 gap-3 border-l border-secondary-3 text-text-1 overflow-auto">
        <div className="flex flex-col gap-2">
          <Card className="shadow-none bg-background">
            <CardBody className="flex flex-col items-center p-2 gap-4">
              <Avatar
                size="xxl"
                alt=""
                src={chat.avatarURL}
                className="border border-secondary-1 bg-avatar"
              />
              <Typography className="text-base font-semibold text-text-1">
                {chat.displayName}
              </Typography>
            </CardBody>
          </Card>
          <div className="text-center w-full px-3">
            <button
              type="button"
              onClick={handleShowProfileClick}
              className="w-full p-1 rounded-md hover:bg-secondary-4 text-base font-semibold text-primary-1"
            >
              Show profile
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Accordion open={openAccordion === 1} animate={customAnimation}>
            <AccordionHeader
              onClick={() => handleOpenAccordion(1)}
              className="flex rounded-md px-3 text-sm font-semibold text-text-1 hover:text-text-1 hover:bg-secondary-4"
            >
              <div className="flex w-full items-center">
                Media, files and links
              </div>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  openAccordion === 1 && "rotate-180"
                }`}
              />
            </AccordionHeader>
            <AccordionBody className="py-1 px-3 gap-1">
              <button className="flex w-full items-center rounded-md p-3 gap-3 text-sm font-semibold text-text-1 hover:text-text-1 hover:bg-secondary-4">
                <PhotoIcon className="h-7 w-7" />
                Media
              </button>
              <button className="flex w-full items-center rounded-md p-3 gap-3 text-sm font-semibold text-text-1 hover:text-text-1 hover:bg-secondary-4">
                <DocumentTextIcon className="h-7 w-7" />
                Files
              </button>
              <button className="flex w-full items-center rounded-md p-3 gap-3 text-sm font-semibold text-text-1 hover:text-text-1 hover:bg-secondary-4">
                <LinkIcon className="h-7 w-7" />
                Links
              </button>
            </AccordionBody>
          </Accordion>
          <Accordion open={openAccordion === 2} animate={customAnimation}>
            <AccordionHeader
              onClick={() => handleOpenAccordion(2)}
              className="flex rounded-md px-3 text-sm font-semibold text-text-1 hover:text-text-1 hover:bg-secondary-4"
            >
              <div className="flex w-full items-center">Settings</div>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  openAccordion === 2 && "rotate-180"
                }`}
              />
            </AccordionHeader>
            <AccordionBody className="py-1 px-3 gap-1">
              <button className="flex w-full items-center rounded-md p-3 gap-3 text-sm font-semibold text-text-1 hover:text-text-1 hover:bg-secondary-4">
                <BellAlertIcon className="h-7 w-7" />
                Notifications
              </button>
              <button className="flex w-full items-center rounded-md p-3 gap-3 text-sm font-semibold text-text-1 hover:text-text-1 hover:bg-secondary-4">
                <NoSymbolIcon className="h-7 w-7" />
                Block
              </button>
              <button className="flex w-full items-center rounded-md p-3 gap-3 text-sm font-semibold text-text-1 hover:text-text-1 hover:bg-secondary-4">
                <FlagIcon className="h-7 w-7" />
                Report
              </button>
            </AccordionBody>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default CustomChat;
