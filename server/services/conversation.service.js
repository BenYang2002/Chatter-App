import prisma from "../prisma.js";
async function createConversation(
  userPK,
  friendPK,
  friendName,
  lastMessage,
  lastMessageDate,
) {
  if (!userPK || !friendPK || !friendName || !lastMessage || !lastMessageDate)
    return null;
  const conversation = await prisma.conversations.create({
    data: {
      userPK: userPK,
      friendPK: friendPK,
      friendName: friendName,
      lastMessage: lastMessage,
      lastMessageDate: lastMessageDate,
    },
  });
  if (!conversation) return null;
  return conversation;
}

async function updateConversationName(userPK, friendPK, friendName) {
  if (!userPK || !friendPK || !friendName) return null;
  const conversation = await prisma.conversations.update({
    where: {
      userPK_friendPK: {
        userPK: userPK,
        friendPK: friendPK,
      },
    },
    data: {
      friendName: friendName,
    },
  });
  if (!conversation) return null;
  return conversation;
}

async function updateConversationLastMessage(
  userPK,
  friendPK,
  lastMessage,
  lastMessageDate,
) {
  if (!userPK || !friendPK || !lastMessage || !lastMessageDate) return null;
  const conversation = await prisma.conversations.update({
    where: {
      userPK_friendPK: {
        userPK: userPK,
        friendPK: friendPK,
      },
    },
    data: {
      lastMessage: lastMessage,
      lastMessageDate: lastMessageDate,
    },
  });
  if (!conversation) return null;
  return conversation;
}

async function getFriendPK(userPK) {
  if (!userPK) return null;
  const conversation = await prisma.conversations.findMany({
    where: {
      userPK: userPK,
    },
  });
  if (!conversation) return null;
  return conversation.map((friend) => {
    return friend.friendPK;
  });
}

async function getLastMessageInfo(userPK, friendPK) {
  if (!userPK || !friendPK) return null;
  const conversation = await prisma.conversations.findUnique({
    where: {
      userPK_friendPK: {
        userPK: userPK,
        friendPK: friendPK,
      },
    },
  });
  if (!conversation) return null;
  return {
    lastMessage: conversation.lastMessage,
    lastMessageDate: conversation.lastMessageDate,
  };
}

export {
  createConversation,
  updateConversationName,
  updateConversationLastMessage,
  getFriendPK,
  getLastMessageInfo,
};
