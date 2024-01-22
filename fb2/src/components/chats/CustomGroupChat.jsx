import {
  ChatBubbleOvalLeftEllipsisIcon,
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
import { CursorArrowRippleIcon } from "@heroicons/react/24/outline";
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
  Textarea,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import GifPicker from "gif-picker-react";
import { useAuth } from "contexts/AuthContext";
import CustomChatMsgGroup from "./CustomChatMsgGroup";
import { db, getUserProfileData, setChatMessage } from "apis/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

const CustomGroupChat = ({ chat }) => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

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
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // HANDLING CHAT SCROLLING
  const chatAreaRef = useRef(null);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, []);

  // SENDING MESSAGES
  const [text, setText] = useState("");

  const handleText = ({ target }) => {
    setText(target.value);
  };
  const sendMessage = async () => {
    if (text.trim() === "") return;
    const content = text;
    setText("");
    await setChatMessage(chat.id, currentUser.uid, content);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  const handleSendClick = () => {
    sendMessage();
  };

  // RECEIVING MESSAGES
  const [messageGroups, setMessageGroups] = useState([]);

  const groupMessages = async (messages) => {
    const maxTimeDiffMins = 5;
    const groupedMessages = [];
    let currentGroup = [];

    for (let i = 0; i < messages.length; i++) {
      if (i === 0) currentGroup.push(messages[i]);
      else {
        const timeDiffMils =
          messages[i].sendDate - currentGroup[currentGroup.length - 1].sendDate;
        const timeDiffMins = timeDiffMils / (1000 * 60);
        if (
          messages[i].sender !== currentGroup[currentGroup.length - 1].sender ||
          timeDiffMins > maxTimeDiffMins
        ) {
          groupedMessages.push([...currentGroup]);
          currentGroup = [messages[i]];
        } else currentGroup.push(messages[i]);
      }
    }

    return groupedMessages;
  };

  useEffect(() => {
    if (chat) {
      const messagesQuery = query(
        collection(db, "chats", chat.id, "messages"),
        orderBy("sendDate")
      );

      const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
        const messages = snapshot.docs.map((doc) => doc.data());
        const groupedMessages = await groupMessages(messages);

        const enrichedGroups = await Promise.all(
          groupedMessages.map(async (messageGroup) => {
            const senderId = messageGroup[0].sender;
            const user = await getUserProfileData(senderId);
            return {
              messages: messageGroup,
              sender: user.id,
              senderAvatarURL: user.avatarURL,
              senderDisplayName: user.displayName,
            };
          })
        );
        setMessageGroups(enrichedGroups);
      });

      return () => unsubscribe();
    }
  }, []);

  // UPLOADING MEDIA
  const filesInputRef = useRef(null);

  const handleFilesClick = () => {
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
    setGifsOpen(true);
  };

  // PICKING EMOJIS
  const [emojisOpen, setEmojisOpen] = useState(false);

  const handleEmojisClick = () => {
    setEmojisOpen(true);
  };

  return (
    <div className="flex w-full h-full">
      {!chat ? (
        <div className="flex flex-col w-full h-full items-center justify-center">
          <ChatBubbleOvalLeftEllipsisIcon className="h-44 w-44 text-primary-2" />
          <CursorArrowRippleIcon className="h-36 w-36 -mt-24 ml-20 text-text-2" />
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-bold text-text-2"
          >
            No chat selected
          </Typography>
        </div>
      ) : (
        <>
          <div className="h-panel flex flex-col w-2/3 text-text-1">
            <Card className="rounded-none bg-container">
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
              className="w-full h-full overflow-auto"
            >
              {messageGroups.map((group) => {
                return <CustomChatMsgGroup msgGroup={group} />;
              })}
            </div>
            <div className="flex w-full justify-center p-3 gap-2">
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
                <Popover>
                  <Tooltip
                    content="Attach a gif"
                    className="bg-tooltip/80 z-auto"
                  >
                    <PopoverHandler>
                      <IconButton className="shadow-none rounded-full bg-transparent hover:bg-secondary-1/40 text-text-2 hover:text-text-1">
                        <GifIcon className="h-6 w-6" />
                      </IconButton>
                    </PopoverHandler>
                  </Tooltip>
                  <PopoverContent className="p-0">
                    <GifPicker
                      tenorApiKey={"AIzaSyCw441pGntBTNbKuH5HE6tJTN8rnzkC3jE"}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="relative flex w-full">
                <Textarea
                  ref={textareaRef}
                  value={text}
                  onChange={handleText}
                  onKeyDown={handleKeyDown}
                  placeholder="Message"
                  rows={1}
                  resize={true}
                  maxLength={1000}
                  color="teal"
                  className="min-h-full placeholder:text-text-4 text-text-1 !border-secondary-2 focus:!border-primary-1 bg-secondary-4"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{
                    className: "min-w-[10rem] bg-secondary-4 rounded-lg grid",
                  }}
                />
                <IconButton
                  disabled={!text}
                  onClick={handleSendClick}
                  className="!absolute right-0 bg-transparent hover:bg-primary-1/30 text-primary-1 disabled:text-secondary-1"
                >
                  <PaperAirplaneIcon
                    className={`h-6 w-6 transition-transform ${
                      text ? "-rotate-90" : "rotate-90"
                    }`}
                  />
                </IconButton>
              </div>
              <div className="flex gap-1">
                <Popover>
                  <Tooltip
                    content="Pick an emoji"
                    className="bg-tooltip/80 z-auto"
                  >
                    <PopoverHandler>
                      <IconButton className="shadow-none rounded-full bg-transparent hover:bg-secondary-1/40 text-text-2 hover:text-text-1">
                        <FaceSmileIcon className="h-6 w-6" />
                      </IconButton>
                    </PopoverHandler>
                  </Tooltip>
                  <PopoverContent className="p-0">
                    <EmojiPicker emojiStyle={EmojiStyle.FACEBOOK} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className="h-panel flex flex-col w-1/3 p-2 gap-3 border-l border-secondary-3 text-text-1 overflow-auto">
            <div className="flex flex-col gap-2">
              <Card className="shadow-none bg-container">
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
                  onClick={() => navigate("/notifications")}
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
        </>
      )}
    </div>
  );
};

export default CustomGroupChat;
