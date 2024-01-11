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
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../api/firebase";
import CustomChatMsgGroup from "./CustomChatMsgGroup";

const CustomChat = ({ chatAvatarURL, chatDisplayName, chatDocRef }) => {
  // CURRENT USER
  const { currentUser } = useAuth();

  // NAVIGATION TO OTHER PAGES
  const navigate = useNavigate();
  const location = useLocation();

  // HANDLING ACTIVE CHAT
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/^\/chats\/(.+)$/);
    if (match) {
      const chatId = match[1];
      setActiveChatId(chatId);
    } else {
      setActiveChatId(null);
    }
  }, []);

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
    const senderId = currentUser.uid;
    const content = text;
    const date = new Date();
    const message = {
      senderId: senderId,
      content: content,
      sendDate: date,
    };
    setText("");
    const chatRef = doc(db, "chats", activeChatId);
    try {
      const messageRef = await addDoc(collection(chatRef, "messages"), message);
      await updateDoc(chatRef, {
        lastMsg: {
          id: messageRef.id,
          senderId: senderId,
          content: content,
          sendDate: date,
        },
      });
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
  const [messageGroups, setMessageGroups] = useState([]);

  // Function to group messages
  const groupMessages = async (messages) => {
    const groupedMessages = [];
    let currentGroup = [];
    for (let i = 0; i < messages.length; i++) {
      if (
        i === 0 ||
        messages[i].senderId !== messages[i - 1].senderId ||
        timeDiffExceeded(messages[i - 1].sendDate, messages[i].sendDate)
      ) {
        // Start a new group if it's the first message, or sender changes, or time difference exceeds 5 minutes
        if (currentGroup.length > 0) {
          groupedMessages.push(currentGroup);
        }
        currentGroup = [messages[i]];
      }
      // Add message to the current group if sender is the same and time difference is within 5 minutes
      else {
        currentGroup.push(messages[i]);
      }
    }
    // Add the last group if it exists
    if (currentGroup.length > 0) {
      groupedMessages.push(currentGroup);
    }

    return groupedMessages;
  };
  // Function to get user document from Firestore
  const getUserData = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.data();
  };
  // Function to check if time difference exceeds 5 minutes
  const timeDiffExceeded = (date1, date2) => {
    const diffInMillis = Math.abs(date2 - date1);
    const diffInMins = diffInMillis / (1000 * 60);

    return diffInMins > 5;
  };

  useEffect(() => {
    if (activeChatId) {
      const messagesRef = collection(db, "chats", activeChatId, "messages");
      const messagesQuery = query(messagesRef, orderBy("sendDate"));

      const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
        const updatedMessages = snapshot.docs.map((doc) => doc.data());
        const updatedGroupedMessages = await groupMessages(updatedMessages);
        setMessageGroups(updatedGroupedMessages);
        // Enrich each group with sender details
        const enrichedGroups = await Promise.all(
          updatedGroupedMessages.map(async (msgGroup) => {
            const senderId = msgGroup[0].senderId;
            if (senderId === currentUser.uid) {
              return {
                msgGroup,
              };
            }
            const user = await getUserData(senderId);
            return {
              msgGroup,
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
      {activeChatId === null ? (
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
            <Card className="rounded-none bg-background">
              <CardBody className="flex items-center gap-4 p-3">
                <Avatar
                  alt="avatar"
                  src={chatAvatarURL}
                  className="border border-secondary-1 bg-avatar"
                />
                <Typography className="text-base font-semibold text-text-1">
                  {chatDisplayName}
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
            <div className="flex flex-col gap-2">
              <Card className="shadow-none bg-background">
                <CardBody className="flex flex-col items-center p-2 gap-4">
                  <Avatar
                    size="xxl"
                    alt=""
                    src={chatAvatarURL}
                    className="border border-secondary-1 bg-avatar"
                  />
                  <Typography className="text-base font-semibold text-text-1">
                    {chatDisplayName}
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

export default CustomChat;
