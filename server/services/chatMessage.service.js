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

export { createNewMessage };
