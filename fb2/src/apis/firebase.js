import { initializeApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  getFirestore,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  doc,
  collection,
  query,
  where,
  limit,
  deleteDoc,
  increment,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { useAuth } from "contexts/AuthContext";

const firebaseConfig = {
  apiKey: "AIzaSyCw441pGntBTNbKuH5HE6tJTN8rnzkC3jE",
  authDomain: "realmate-12bb1.firebaseapp.com",
  projectId: "realmate-12bb1",
  storageBucket: "realmate-12bb1.appspot.com",
  messagingSenderId: "66597990953",
  appId: "1:66597990953:web:da4b516a45fe4afaeee238",
  measurementId: "G-PRW55SVFCX",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore(app);
export default app;

// FETCHING

// TEMPLATE FUNCTIONS
const getKeywordSetsData = async (userId, col, subcol, term, max) => {
  if (term > 0) {
    const lcTerm = term.toLowerCase();
    const documsQuery = query(
      collection(db, col, userId, subcol),
      where("keywords", "array-contains", lcTerm),
      limit(max)
    );
    const docums = await getDocs(documsQuery);
    return docums.docs.map((docum) => docum.data());
  } else return [];
};

const getEntityData = async (id, col) => {
  const docum = await getDoc(doc(db, col, id));
  return docum.data();
};

const getSubEntityData = async (id, col, subId, subcol) => {
  const docum = await getDoc(doc(db, col, id, subcol, subId));
  return docum.data();
};

const getEntitiesData = async (id, col, subcol) => {
  const documsQuery = await query(collection(db, col, id, subcol));
  const docums = await getDocs(documsQuery);
  return docums.docs.map((docum) => docum.data());
};

// SEARCH
export const getUserKeywordSetsData = async (term, max = 5) => {
  if (term.length > 0) {
    const lcTerm = term.toLowerCase();
    const documsQuery = query(
      collection(db, "userKeywordSets"),
      where("keywords", "array-contains", lcTerm),
      limit(max)
    );
    const docums = await getDocs(documsQuery);
    return docums.docs.map((docum) => docum.data());
  } else return [];
};

export const getGroupKeywordSetsData = async (term, max = 5) => {
  if (term.length > 0) {
    const lcTerm = term.toLowerCase();
    const documsQuery = query(
      collection(db, "groupKeywordSets"),
      where("keywords", "array-contains", lcTerm),
      limit(max)
    );
    const docums = await getDocs(documsQuery);
    return docums.docs.map((docum) => docum.data());
  } else return [];
};

export const getUserFriendKeywordSetsData = async (userId, term, max = 5) => {
  return await getKeywordSetsData(
    userId,
    "userFriends",
    "friendKeywordSets",
    term,
    max
  );
};

export const getUserGroupKeywordSetsData = async (userId, term, max = 5) => {
  return await getKeywordSetsData(
    userId,
    "userGroups",
    "groupKeywordSets",
    term,
    max
  );
};

export const getUserChatKeywordSetsData = async (userId, term, max = 5) => {
  return await getKeywordSetsData(
    userId,
    "userChats",
    "chatKeywordSets",
    term,
    max
  );
};

export const getUserGroupChatKeywordSetsData = async (
  userId,
  term,
  max = 5
) => {
  return await getKeywordSetsData(
    userId,
    "userGroupChats",
    "groupChatKeywordSets",
    term,
    max
  );
};

export const getUserChatsWithPartnerData = async (userId, partnerId) => {
  const documsQuery = query(
    collection(db, "userChats", userId, "chats"),
    where("partner", "==", partnerId)
  );
  const docums = await getDocs(documsQuery);
  return docums.docs.map((docum) => docum.data());
};

// USERS
export const getUserKeywordSetData = async (userId) => {
  return await getEntityData(userId, "userKeywordSets");
};

export const getUserProfileData = async (userId) => {
  return await getEntityData(userId, "userProfiles");
};

export const getUserPrefsData = async (userId) => {
  return await getEntityData(userId, "userPrefs");
};

export const getUserAboutData = async (userId) => {
  return await getEntityData(userId, "userAbouts");
};

export const getUserFamilyData = async (userId) => {
  return await getEntityData(userId, "userFamilies");
};

export const getUserFriendsData = async (userId) => {
  return await getEntitiesData(userId, "userFriends", "friends");
};

export const getUserIncomingFriendInvitesData = async (userId) => {
  return await getEntitiesData(userId, "userFriendInvites", "incoming");
};

export const getUserOutgoingFriendInvitesData = async (userId) => {
  return await getEntitiesData(userId, "userFriendInvites", "outgoing");
};

export const getUserGroupsData = async (userId) => {
  return await getEntitiesData(userId, "userGroups", "groups");
};

export const getUserIncomingGroupInvitesData = async (userId) => {
  return await getEntitiesData(userId, "userGroupInvites", "incoming");
};

export const getUserOutgoingGroupInvitesData = async (userId) => {
  return await getEntitiesData(userId, "userGroupInvites", "outgoing");
};

export const getUserChatsData = async (userId) => {
  return await getEntitiesData(userId, "userChats", "chats");
};

export const getUserGroupChatsData = async (userId) => {
  return await getEntitiesData(userId, "userGroupChats", "groupChats");
};

export const getUserPostsData = async (userId) => {
  return await getEntitiesData(userId, "userPosts", "posts");
};

export const getUserImagesData = async (userId) => {
  return await getEntityData(userId, "userImages");
};

export const getUserVideosData = async (userId) => {
  return await getEntityData(userId, "userVideos");
};

export const getUserLinksData = async (userId) => {
  return await getEntityData(userId, "userLinks");
};

// FRIENDS
export const getUserFriendData = async (userId, friendId) => {
  return await getSubEntityData(userId, "userFriends", friendId, "friends");
};

// GROUPS
export const getUserGroupData = async (userId, groupId) => {
  return await getSubEntityData(userId, "userGroups", groupId, "groups");
};

export const getGroupKeywordSetData = async (groupId) => {
  return await getEntityData(groupId, "groupKeywordSets");
};

export const getGroupProfileData = async (groupId) => {
  return await getEntityData(groupId, "groupProfiles");
};

export const getGroupPrefsData = async (groupId) => {
  return await getEntityData(groupId, "groupPrefs");
};

export const getGroupAboutData = async (groupId) => {
  return await getEntityData(groupId, "groupAbouts");
};

export const getGroupMembersData = async (groupId) => {
  return await getEntityData(groupId, "groupMembers");
};

export const getGroupPostsData = async (groupId) => {
  return await getEntitiesData(groupId, "groupPosts", "posts");
};

export const getGroupImagesData = async (groupId) => {
  return await getEntityData(groupId, "groupImages");
};

export const getGroupVideosData = async (groupId) => {
  return await getEntityData(groupId, "groupVideos");
};

export const getGroupLinksData = async (groupId) => {
  return await getEntityData(groupId, "groupLinks");
};

// CHATS
export const getUserChatData = async (userId, chatId) => {
  return await getSubEntityData(userId, "userChats", chatId, "chats");
};

export const getChatData = async (chatId) => {
  return await getEntityData(chatId, "chats");
};

// GROUP CHATS
export const getGroupChatProfileData = async (chatId) => {
  return await getEntityData(chatId, "groupChatProfiles");
};

export const getUserGroupChatData = async (userId, chatId) => {
  return await getSubEntityData(userId, "userGroupChats", chatId, "groupChats");
};

export const getGroupChatData = async (chatId) => {
  return await getEntityData(chatId, "groupChats");
};

export const getGroupChatMembersData = async (chatId) => {
  return await getEntityData(chatId, "groupChatMembers");
};

// MESSAGES
export const getChatMessage = async (chatId, messageId) => {
  return await getSubEntityData(chatId, "chats", messageId, "messages");
};

export const getChatMessages = async (chatId) => {
  const documsQuery = await query(
    collection(db, "chats", chatId, "messages"),
    orderBy("sendDate")
  );
  const docums = await getDocs(documsQuery);
  return docums.docs.map((docum) => docum.data());
};

export const getChatMessageReaction = async (chatId, messageId, reactorId) => {
  const docum = await getDoc(
    doc(db, "chats", chatId, "messages", messageId, "reactions", reactorId)
  );
  return docum.data();
};

export const getGroupChatMessage = async (chatId, messageId) => {
  return await getSubEntityData(chatId, "groupChats", messageId, "messages");
};

export const getGroupChatMessageReaction = async (
  chatId,
  messageId,
  reactorId
) => {
  const docum = await getDoc(
    doc(db, "groupChats", chatId, "messages", messageId, "reactions", reactorId)
  );
  return docum.data();
};

// POSTS
export const getUserPost = async (userId, postId) => {
  return await getSubEntityData(userId, "userPosts", postId, "posts");
};

export const getGroupPost = async (groupId, postId) => {
  return await getSubEntityData(groupId, "groupPosts", postId, "posts");
};

// COMMENTS
export const getUserPostComment = async (userId, postId, commentIds) => {
  let docRef = doc(db, "userPosts", userId, "posts", postId);
  for (const commentId of commentIds)
    docRef = doc(docRef, "comments", commentId);
  const docum = await getDoc(docRef);
  return docum.data();
};

export const getUserPostCommentReaction = async (
  userId,
  postId,
  commentIds,
  reactorId
) => {
  let docRef = doc(db, "userPosts", userId, "posts", postId);
  for (const commentId of commentIds)
    docRef = doc(docRef, "comments", commentId);
  docRef = doc(docRef, "reactions", reactorId);
  const docum = await getDoc(docRef);
  return docum.data();
};

export const getGroupPostComment = async (groupId, postId, commentIds) => {
  let docRef = doc(db, "groupPosts", groupId, "posts", postId);
  for (const commentId of commentIds)
    docRef = doc(docRef, "comments", commentId);
  const docum = await getDoc(docRef);
  return docum.data();
};

export const getGroupPostCommentReaction = async (
  groupId,
  postId,
  commentIds,
  reactorId
) => {
  let docRef = doc(db, "groupPosts", groupId, "posts", postId);
  for (const commentId of commentIds)
    docRef = doc(docRef, "comments", commentId);
  docRef = doc(docRef, "reactions", reactorId);
  const docum = await getDoc(docRef);
  return docum.data();
};

// CHECKS
export const isUserFamily = async (userId) => {
  const docum = await getDoc(doc(db, "userFamilies", userId));
  return docum.exists();
};

export const isUserFriend = async (userId, otherUserId) => {
  const docum = await getDoc(
    doc(db, "userFriends", userId, "friends", otherUserId)
  );
  return docum.exists();
};

export const isUserFriendInviteSent = async (userId, otherUserId) => {
  const docum = await getDoc(
    doc(db, "userFriendInvites", userId, "outgoing", otherUserId)
  );
  return docum.exists();
};

export const isUserFriendInviteReceived = async (userId, otherUserId) => {
  const docum = await getDoc(
    doc(db, "userFriendInvites", userId, "incoming", otherUserId)
  );
  return docum.exists();
};

export const isUserGroupMember = async (userId, groupId) => {
  const docum = await getDoc(doc(db, "userGroups", userId, "groups", groupId));
  return docum.exists();
};

export const isUserGroupInviteSent = async (userId, groupId) => {
  const documsQuery = query(
    collection(db, "userGroupInvites", userId, "outgoing"),
    where("group", "==", groupId)
  );
  const docums = await getDocs(documsQuery);
  return docums[0].exists();
};

export const isUserGroupInviteReceived = async (userId, groupId) => {
  const documsQuery = query(
    collection(db, "userGroupInvites", userId, "incoming"),
    where("group", "==", groupId)
  );
  const docums = await getDocs(documsQuery);
  return docums[0].exists();
};

// ADDING

// USERS
export const setUserKeywordSet = async (userId, keywords) => {
  await setDoc(doc(db, "userKeywordSets", userId), {
    id: userId,
    keywords: keywords,
    isVisible: true,
  });
};

export const setUserProfile = async (userId, fullName, avatarURL) => {
  await setDoc(doc(db, "userProfiles", userId), {
    id: userId,
    displayName: fullName,
    avatarURL: avatarURL,
    lastActive: new Date(),
  });
};

export const setUserPrefs = async (userId) => {
  await setDoc(doc(db, "userPrefs", userId), {
    id: userId,
    isDarkMode: null,
    isPublic: true,
  });
};

export const setUserAbout = async (
  userId,
  firstName,
  lastName,
  email,
  birthdate,
  backgroundURL
) => {
  await setDoc(doc(db, "userAbouts", userId), {
    id: userId,
    firstName: firstName,
    lastName: lastName,
    email: email,
    isMale: null,
    birthdate: birthdate,
    postalCode: null,
    city: null,
    country: null,
    phoneNumber: null,
    backgroundURL: backgroundURL,
    friendCount: 0,
    creationDate: new Date(),
  });
};

// FRIENDS
export const setUserFriend = async (userId, otherUserId) => {
  const startDate = new Date();
  await setDoc(doc(db, "userFriends", userId, "friends", otherUserId), {
    id: otherUserId,
    startDate: startDate,
    isClose: false,
  });
  await setDoc(doc(db, "userFriends", otherUserId, "friends", userId), {
    id: userId,
    startDate: startDate,
    isClose: false,
  });

  const userKeywordSet = await getUserKeywordSetData(userId);
  const otherUserKeywordSet = await getUserKeywordSetData(otherUserId);
  await setDoc(
    doc(db, "userFriends", userId, "friendKeywordSets", otherUserId),
    {
      id: otherUserId,
      keywords: otherUserKeywordSet.keywords,
    }
  );
  await setDoc(
    doc(db, "userFriends", otherUserId, "friendKeywordSets", userId),
    {
      id: userId,
      keywords: userKeywordSet.keywords,
    }
  );

  await updateDoc(doc(db, "userAbouts", userId), {
    friendCount: increment(1),
  });
  await updateDoc(doc(db, "userAbouts", otherUserId), {
    friendCount: increment(1),
  });

  deleteUserFriendInvite(otherUserId, userId);
};

export const setUserFriendInvite = async (userId, otherUserId) => {
  const sendDate = new Date();
  await setDoc(doc(db, "userFriendInvites", userId, "outgoing", otherUserId), {
    id: otherUserId,
    sendDate: sendDate,
  });
  await setDoc(doc(db, "userFriendInvites", otherUserId, "incoming", userId), {
    id: userId,
    sendDate: sendDate,
  });
};

// CHATS
export const setChat = async (userId, partnerId) => {
  const date = new Date();
  const docum = await addDoc(collection(db, "chats"), {
    id: null,
    lastMessage: null,
    creationDate: date,
  });
  await updateDoc(doc(db, "chats", docum.id), {
    id: docum.id,
  });

  await setDoc(doc(db, "userChats", userId, "chats", docum.id), {
    id: docum.id,
    partner: partnerId,
    lastActive: date,
    isMuted: false,
    isBlocked: false,
  });
  await setDoc(doc(db, "userChats", partnerId, "chats", docum.id), {
    id: docum.id,
    partner: userId,
    lastActive: date,
    isMuted: false,
    isBlocked: false,
  });

  const userKeywordSet = await getUserKeywordSetData(userId);
  const partnerKeywordSet = await getUserKeywordSetData(partnerId);
  await setDoc(doc(db, "userChats", userId, "chatKeywordSets", docum.id), {
    id: docum.id,
    partner: partnerId,
    keywords: partnerKeywordSet.keywords,
  });
  await setDoc(doc(db, "userChats", partnerId, "chatKeywordSets", docum.id), {
    id: docum.id,
    partner: userId,
    keywords: userKeywordSet.keywords,
  });

  return docum.id;
};

// MESSAGES
export const setChatMessage = async (chatId, userId, content) => {
  const docum = await addDoc(collection(db, "chats", chatId, "messages"), {
    id: null,
    sender: userId,
    content: content,
    sendDate: new Date(),
  });
  await updateDoc(doc(db, "chats", chatId, "messages", docum.id), {
    id: docum.id,
  });

  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: docum.id,
  });
};

// UPDATING

// USERS
export const updateUserLastActive = async (userId) => {
  await updateDoc(doc(db, "userProfiles", userId), {
    lastActive: new Date(),
  });
};

export const updateUserChatLastActive = async (userId, chatId) => {
  await updateDoc(doc(db, "userChats", userId, "chats", chatId), {
    lastActive: new Date(),
  });
};

export const updateUserFriendIsClose = async (userId, friendId, value) => {
  await updateDoc(doc(db, "userFriends", userId, "friends", friendId), {
    isClose: value,
  });
};

export const updateUserProfileImage = async (user, file) => {
  const storageRef = ref(storage, `avatars/${user.uid}`);
  await uploadBytes(storageRef, file);
  const avatarDownloadURL = await getDownloadURL(storageRef);
  await updateProfile(user, {
    photoURL: avatarDownloadURL,
  });
  await updateDoc(doc(db, "userProfiles", user.uid), {
    avatarURL: avatarDownloadURL,
  });
};

export const updateUserBackgroundImage = async (userId, file) => {
  const storageRef = ref(storage, `backgrounds/${userId}`);
  await uploadBytes(storageRef, file);
  const backgroundDownloadURL = await getDownloadURL(storageRef);
  await updateDoc(doc(db, "userAbouts", userId), {
    backgroundURL: backgroundDownloadURL,
  });
};

// DELETING

// FRIENDS
export const deleteUserFriend = async (userId, friendId) => {
  await deleteDoc(doc(db, "userFriends", userId, "friends", friendId));
  await deleteDoc(doc(db, "userFriends", friendId, "friends", userId));

  await deleteDoc(
    doc(db, "userFriends", userId, "friendKeywordSets", friendId)
  );
  await deleteDoc(
    doc(db, "userFriends", friendId, "friendKeywordSets", userId)
  );

  await updateDoc(doc(db, "userAbouts", userId), {
    friendCount: increment(-1),
  });
  await updateDoc(doc(db, "userAbouts", friendId), {
    friendCount: increment(-1),
  });
};

export const deleteUserFriendInvite = async (userId, otherUserId) => {
  await deleteDoc(
    doc(db, "userFriendInvites", userId, "outgoing", otherUserId)
  );
  await deleteDoc(
    doc(db, "userFriendInvites", otherUserId, "incoming", userId)
  );
};

// MESSAGES
export const deleteChatMessage = async (chatId, messageId) => {
  await deleteDoc(doc(db, "chats", chatId, "messages", messageId));
};
