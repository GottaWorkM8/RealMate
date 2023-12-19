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
import CustomChatMsg from "./CustomChatMsg";
import PropTypes from "prop-types";
import { useAuth } from "contexts/AuthContext";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";

const CustomChat = (props) => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  // HANDLING ACTIVE CHAT
  const [activeChatId, setActiveChat] = useState(null);

  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/^\/chats\/(.+)$/);
    if (match) {
      const chatId = match[1];
      setActiveChat(chatId);
    } else {
      setActiveChat(null);
    }
  }, [location.pathname]);

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
  const handleTextareaHeight = () => {
    textareaRef.current.style.height = "inherit";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };
  const handleChatAreaClick = () => {
    textareaRef.current.focus();
  };

  useEffect(() => {
    setText("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeChatId]);

  // HANDLING CHAT SCROLLING
  const chatAreaRef = useRef(null);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [activeChatId]);

  // SENDING MESSAGES
  const [text, setText] = useState("");
  const handleText = ({ target }) => {
    setText(target.value);
  };
  const sendMessage = async () => {
    if (text.trim() === "") return;
    const message = {
      content: text,
      sender: currentUser.uid,
      sendTime: new Date(),
    };
    setText("");
    const chatRef = collection(db, "chats", activeChatId, "messages");
    try {
      await addDoc(chatRef, message);
      console.log("Message uploaded to Firestore");
    } catch (error) {
      console.error("Error uploading message to Firestore:", error);
    }
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
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (activeChatId) {
      const messagesRef = collection(db, "chats", activeChatId, "messages");
      const messagesQuery = query(messagesRef, orderBy("sendTime"));

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const updatedMessages = snapshot.docs.map((doc) => doc.data());
        setMessages(updatedMessages);
      });

      return () => unsubscribe();
    }
  }, [activeChatId]);

  // DISPLAYING MESSAGES
  const renderMessages = () => {
    return messages.map((content, sender, sendTime) => (
      <CustomChatMsg
        avatar={sender === currentUser.uid ? null : props.avatar}
        msg={content}
      />
    ));
  };

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
      {activeChatId === null ? (
        <div className="flex flex-col w-full h-full items-center justify-center">
          <ChatBubbleOvalLeftEllipsisIcon className="h-44 w-44 text-primary-2"></ChatBubbleOvalLeftEllipsisIcon>
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
            <Card className="rounded-none bg-background">
              <CardBody className="p-3">
                <div className="flex items-center gap-4">
                  <Avatar
                    alt=""
                    src={props.avatar}
                    className="border border-secondary-1 bg-avatar"
                  />
                  <div>
                    <Typography className="text-base font-semibold text-text-1">
                      {props.displayName}
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
            <div
              ref={chatAreaRef}
              onClick={handleChatAreaClick}
              className="w-full h-full overflow-auto"
            >
              {messages.map(({ content, sender, sendTime }) => {
                return (
                  <CustomChatMsg
                    avatar={sender === currentUser.uid ? null : props.avatar}
                    msg={content}
                  />
                );
              })}
            </div>
            <div className="flex w-full justify-center p-3 gap-2">
              <div className="flex gap-1">
                <input
                  type="file"
                  ref={filesInputRef}
                  onChange={handleFilesChange}
                  hidden
                />
                <Tooltip content="Attach a file" className="bg-tooltip/80">
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
            <div>
              <Card className="shadow-none bg-background">
                <CardBody className="p-2">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar
                      size="xxl"
                      alt=""
                      src={props.avatar}
                      className="border border-secondary-1 bg-avatar"
                    />
                    <div>
                      <Typography className="text-base font-semibold text-text-1">
                        {props.displayName}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="text-center w-full">
                <button
                  type="button"
                  onClick={() => navigate("/notifications")}
                  className="w-full p-3 rounded-md hover:bg-secondary-4 text-base font-semibold text-primary-1"
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
                      openAccordion === 1 ? "rotate-180" : ""
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
                      openAccordion === 2 ? "rotate-180" : ""
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

CustomChat.propTypes = {
  avatar: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CustomChat;
