import prisma from "../prisma.js";
import bcrypt, { compareSync } from "bcrypt";
async function createFriendRequest(userId, friendId, state) {
  if (!userId || !friendId) return null;
  const friendRequest = await prisma.friend.create({
    data: {
      userId1: userId,
      userId2: friendId,
      state: state,
    },
  });
  return friendRequest;
}

async function findFriendRequest(userId, friendId) {
  const friendRequest = await prisma.friend.findUnique({
    where: {
      userId1_userId2: {
        userId1: userId,
        userId2: friendId,
      },
    },
  });
  if (!friendRequest) {
    const friendRequest2 = await prisma.friend.findUnique({
      where: {
        userId1_userId2: {
          userId1: friendId,
          userId2: userId,
        },
      },
    });
    if (!friendRequest2) return null;
    return friendRequest2;
  } else {
    return friendRequest;
  }
}

export { createFriendRequest, findFriendRequest };
