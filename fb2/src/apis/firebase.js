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
  orderBy,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

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
  if (term.length > 0) {
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

export const getGroupChatKeywordSetData = async (chatId) => {
  return await getEntityData(chatId, "groupChatKeywordSets");
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

export const isUserGroupAdmin = async (userId, groupId) => {
  const docum = await getDoc(doc(db, "groupMembers", groupId));
  const adminId = docum.data().admin;
  return adminId === userId;
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
  return docums.size > 0;
};

export const isUserGroupInviteReceived = async (userId, groupId) => {
  const documsQuery = query(
    collection(db, "userGroupInvites", userId, "incoming"),
    where("group", "==", groupId)
  );
  const docums = await getDocs(documsQuery);
  if (docums.size) return true;
  return docums.size > 0;
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
export const setUserFriendKeywordSet = async (userId, friendId, keywords) => {
  await setDoc(doc(db, "userFriends", userId, "friendKeywordSets", friendId), {
    id: friendId,
    keywords: keywords,
  });
};

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
  await setUserFriendKeywordSet(
    userId,
    otherUserId,
    otherUserKeywordSet.keywords
  );
  await setUserFriendKeywordSet(otherUserId, userId, userKeywordSet.keywords);

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

// GROUPS
export const setGroupKeywordSet = async (groupId, keywords) => {
  await setDoc(doc(db, "groupKeywordSets", groupId), {
    id: groupId,
    keywords: keywords,
    isVisible: true,
    isSafeForWork: true,
  });
};

export const setUserGroupKeywordSet = async (userId, groupId, keywords) => {
  await setDoc(doc(db, "userGroups", userId, "groupKeywordSets", groupId), {
    id: groupId,
    keywords: keywords,
  });
};

export const setGroupProfile = async (groupId, name, avatarFile) => {
  let storageRef;
  if (avatarFile) {
    storageRef = ref(storage, `avatars/groups/${groupId}`);
    await uploadBytes(storageRef, avatarFile);
  } else storageRef = ref(storage, "avatars/groups/group.png");
  const avatarDownloadURL = await getDownloadURL(storageRef);
  await setDoc(doc(db, "groupProfiles", groupId), {
    id: groupId,
    displayName: name,
    avatarURL: avatarDownloadURL,
  });
};

export const setGroupPrefs = async (groupId) => {
  await setDoc(doc(db, "groupPrefs", groupId), {
    id: groupId,
    isPublic: true,
    isSafeForWork: true,
  });
};

export const setGroupAbout = async (groupId, description, backgroundURL) => {
  await setDoc(doc(db, "groupAbouts", groupId), {
    id: groupId,
    description: description,
    memberCount: 0,
    backgroundURL: backgroundURL,
    creationDate: new Date(),
  });
};

export const setUserGroup = async (groupId, userId, isFavorite) => {
  await setDoc(doc(db, "userGroups", userId, "groups", groupId), {
    id: groupId,
    joinDate: new Date(),
    isFavorite: isFavorite,
  });
  const groupKeywordSet = await getGroupKeywordSetData(groupId);
  await setUserGroupKeywordSet(userId, groupId, groupKeywordSet.keywords);
  await updateGroupMembers(groupId, userId);
};

export const setGroupMembers = async (groupId, adminId) => {
  await setDoc(doc(db, "groupMembers", groupId), {
    id: groupId,
    admin: adminId,
    members: [],
  });
};

export const setGroup = async (
  userId,
  memberIds,
  name,
  avatarFile,
  description,
  keywords
) => {
  const docum = await addDoc(collection(db, "groupKeywordSets"), {
    id: null,
    keywords: keywords,
    isVisible: true,
    isSafeForWork: true,
  });
  await updateDoc(doc(db, "groupKeywordSets", docum.id), {
    id: docum.id,
  });

  await setGroupProfile(docum.id, name, avatarFile);
  await setGroupPrefs(docum.id);
  const bgDownloadURL = await getDownloadURL(
    ref(storage, "backgrounds/groups/background.jpg")
  );
  await setGroupAbout(docum.id, description, bgDownloadURL);
  await setGroupMembers(docum.id, userId);
  await setGroupInvites(userId, docum.id, memberIds);
  await setUserGroup(docum.id, userId, true);

  return docum.id;
};

const setGroupInvites = async (userId, groupId, otherUserIds) => {
  const sendDate = new Date();
  for (const otherUserId of otherUserIds) {
    const docum = await addDoc(
      collection(db, "userGroupInvites", userId, "outgoing"),
      {
        id: null,
        group: groupId,
        receiver: otherUserId,
        sendDate: sendDate,
      }
    );
    await updateDoc(doc(db, "userGroupInvites", userId, "outgoing", docum.id), {
      id: docum.id,
    });

    await setDoc(
      doc(db, "userGroupInvites", otherUserId, "incoming", docum.id),
      {
        id: docum.id,
        group: groupId,
        sender: userId,
        sendDate: sendDate,
      }
    );
  }
};

export const setUserGroupInvite = async (userId, groupId) => {
  const group = await getGroupMembersData(groupId);
  const sendDate = new Date();
  const docum = await addDoc(
    collection(db, "userGroupInvites", userId, "outgoing"),
    {
      id: null,
      group: groupId,
      receiver: group.admin,
      sendDate: sendDate,
    }
  );
  await updateDoc(doc(db, "userGroupInvites", userId, "outgoing", docum.id), {
    id: docum.id,
  });

  await setDoc(doc(db, "userGroupInvites", group.admin, "incoming", docum.id), {
    id: docum.id,
    group: groupId,
    sender: userId,
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

// GROUP CHATS
export const setGroupChatKeywordSet = async (chatId, keywords) => {
  await setDoc(doc(db, "groupChatKeywordSets", chatId), {
    id: chatId,
    keywords: keywords,
  });
};

export const setUserGroupChatKeywordSet = async (userId, chatId, keywords) => {
  await setDoc(
    doc(db, "userGroupChats", userId, "groupChatKeywordSets", chatId),
    {
      id: chatId,
      keywords: keywords,
    }
  );
};

export const setGroupChatProfile = async (chatId, name, avatarFile) => {
  let storageRef;
  if (avatarFile) {
    storageRef = ref(storage, `avatars/groupChats/${chatId}`);
    await uploadBytes(storageRef, avatarFile);
  } else storageRef = ref(storage, "avatars/groupChats/groupChat.png");
  const avatarDownloadURL = await getDownloadURL(storageRef);
  await setDoc(doc(db, "groupChatProfiles", chatId), {
    id: chatId,
    displayName: name,
    avatarURL: avatarDownloadURL,
  });
};

export const setUserGroupChat = async (chatId, userId) => {
  const date = new Date();
  await setDoc(doc(db, "userGroupChats", userId, "groupChats", chatId), {
    id: chatId,
    joinDate: date,
    lastActive: date,
    isMuted: false,
  });
  const groupChatKeywordSet = await getGroupChatKeywordSetData(chatId);
  await setUserGroupChatKeywordSet(
    userId,
    chatId,
    groupChatKeywordSet.keywords
  );
  await updateGroupChatMembers(chatId, userId);
};

export const setGroupChatMembers = async (chatId, adminId) => {
  await setDoc(doc(db, "groupChatMembers", chatId), {
    id: chatId,
    admin: adminId,
    members: [],
  });
};

export const setGroupChat = async (
  userId,
  memberIds,
  name,
  avatarFile,
  keywords
) => {
  const docum = await addDoc(collection(db, "groupChatKeywordSets"), {
    id: null,
    keywords: keywords,
  });
  await updateDoc(doc(db, "groupChatKeywordSets", docum.id), {
    id: docum.id,
  });
  await setDoc(doc(db, "groupChats", docum.id), {
    id: docum.id,
    lastMessage: null,
    creationDate: new Date(),
  });
  await setGroupChatProfile(docum.id, name, avatarFile);
  await setGroupChatMembers(docum.id, userId);
  await setUserGroupChat(docum.id, userId);
  for (const memberId of memberIds) await setUserGroupChat(docum.id, memberId);

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

export const setGroupChatMessage = async (chatId, userId, content) => {
  const docum = await addDoc(collection(db, "groupChats", chatId, "messages"), {
    id: null,
    sender: userId,
    content: content,
    sendDate: new Date(),
  });
  await updateDoc(doc(db, "groupChats", chatId, "messages", docum.id), {
    id: docum.id,
  });

  await updateDoc(doc(db, "groupChats", chatId), {
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

export const updateUserGroupChatLastActive = async (userId, chatId) => {
  await updateDoc(doc(db, "userGroupChats", userId, "groupChats", chatId), {
    lastActive: new Date(),
  });
};

export const updateUserProfileImage = async (user, file) => {
  const storageRef = ref(storage, `avatars/users/${user.uid}`);
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
  const storageRef = ref(storage, `backgrounds/users/${userId}`);
  await uploadBytes(storageRef, file);
  const bgDownloadURL = await getDownloadURL(storageRef);
  await updateDoc(doc(db, "userAbouts", userId), {
    backgroundURL: bgDownloadURL,
  });
};

// FRIENDS
export const updateUserFriendIsClose = async (userId, friendId, value) => {
  await updateDoc(doc(db, "userFriends", userId, "friends", friendId), {
    isClose: value,
  });
};

// GROUPS
export const updateGroupProfileImage = async (groupId, file) => {
  const storageRef = ref(storage, `avatars/groups/${groupId}`);
  await uploadBytes(storageRef, file);
  const avatarDownloadURL = await getDownloadURL(storageRef);
  await updateDoc(doc(db, "groupProfiles", groupId), {
    avatarURL: avatarDownloadURL,
  });
};

export const updateGroupBackgroundImage = async (groupId, file) => {
  const storageRef = ref(storage, `backgrounds/groups/${groupId}`);
  await uploadBytes(storageRef, file);
  const bgDownloadURL = await getDownloadURL(storageRef);
  await updateDoc(doc(db, "groupAbouts", groupId), {
    backgroundURL: bgDownloadURL,
  });
};

export const updateUserGroupIsFavorite = async (userId, groupId, value) => {
  await updateDoc(doc(db, "userGroups", userId, "groups", groupId), {
    isFavorite: value,
  });
};

const updateGroupMembers = async (groupId, memberId) => {
  const group = await getGroupMembersData(groupId);
  const updatedMembers = [...group.members, memberId];

  await updateDoc(doc(db, "groupMembers", groupId), {
    members: updatedMembers,
  });

  await updateDoc(doc(db, "groupAbouts", groupId), {
    memberCount: increment(1),
  });
};

// CHATS
// GROUP CHATS
const updateGroupChatMembers = async (chatId, memberId) => {
  const groupChat = await getGroupChatMembersData(chatId);
  const updatedMembers = [...groupChat.members, memberId];

  await updateDoc(doc(db, "groupChatMembers", chatId), {
    members: updatedMembers,
  });
};

// DELETING

// USERS

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

// GROUPS
export const deleteUserGroup = async (userId, groupId) => {
  await deleteDoc(doc(db, "userGroups", userId, "groups", groupId));
  await deleteDoc(doc(db, "userGroups", userId, "groupKeywordSets", groupId));

  await deleteGroupMember(userId, groupId);
};

const deleteGroupMember = async (userId, groupId) => {
  const group = await getGroupMembersData(groupId);
  const updatedMembers = group.members.filter(
    (memberId) => memberId !== userId
  );
  await updateDoc(doc(db, "groupMembers", groupId), {
    members: updatedMembers,
  });

  await updateDoc(doc(db, "groupAbouts", groupId), {
    memberCount: increment(-1),
  });
};

export const deleteUserGroupInvite = async (userId, groupId) => {
  const group = await getGroupMembersData(groupId);
  await deleteDoc(doc(db, "userGroupInvites", userId, "outgoing", group.admin));
  await deleteDoc(doc(db, "userGroupInvites", group.admin, "incoming", userId));
};

// CHATS
// GROUP CHATS

// MESSAGES
export const deleteChatMessage = async (chatId, messageId) => {
  await deleteDoc(doc(db, "chats", chatId, "messages", messageId));
};
