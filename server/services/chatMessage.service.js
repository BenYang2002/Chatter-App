import prisma from "../prisma.js";
async function createNewMessage(userPK, friendPK, content, type, creationTime) {
  if (!userPK || !friendPK || !content || !type || !creationTime) return null;
  const message = await prisma.chatMessages.create({
    data: {
      senderPK: userPK,
      receiverPK: friendPK,
      content: content,
      type: type,
      createAt: creationTime,
    },
  });
  return message;
}

async function getChatHistory(userPK, friendPK) {
  if (!userPK || !friendPK) return null;
  const messages = await prisma.chatMessages.findMany({
    where: {
      OR: [
        { senderPK: userPK, receiverPK: friendPK },
        { senderPK: friendPK, receiverPK: userPK },
      ],
    },
  });
  return messages;
}

export { createNewMessage, getChatHistory };
