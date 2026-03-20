import prisma from "../prisma.js";
import bcrypt, { compareSync } from "bcrypt";
async function createFriendRequest(userId, friendId, state) {
  if (!userId || !friendId) return null;
  const friendRequest = await prisma.friend.create({
    data: {
      initiator: userId,
      friendId: friendId,
      state: state,
    },
  });
  return friendRequest;
}

async function findFriendRequest(userId, friendId) {
  if (!userId || !friendId) return null;
  const friendRequest = await prisma.friend.findUnique({
    where: {
      initiator_friendId: {
        initiator: userId,
        friendId: friendId,
      },
    },
  });
  if (!friendRequest) {
    const friendRequest2 = await prisma.friend.findUnique({
      where: {
        initiator_friendId: {
          initiator: friendId,
          friendId: userId,
        },
      },
    });
    if (!friendRequest2) return null;
    return friendRequest2;
  } else {
    return friendRequest;
  }
}

async function findAllFriend(userId) {
  const friendRequest = await prisma.friend.findMany({
    where: {
      friendId: userId,
    },
  });
  return friendRequest;
}

export { createFriendRequest, findFriendRequest, findAllFriend };
