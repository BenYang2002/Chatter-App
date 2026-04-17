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
      OR: [{ initiator: userId }, { friendId: userId }],
    },
  });
  return friendRequest;
}

async function acceptFriendRequest(userId, friendId) {
  if (!userId || !friendId) return null;
  const friendRequest = await prisma.friend.update({
    where: {
      initiator_friendId: {
        initiator: friendId,
        friendId: userId,
      },
    },
    data: {
      state: "accepted",
    },
  });
  return friendRequest;
}

async function declineFriendRequest(userId, friendId) {
  if (!userId || !friendId) return false;
  await prisma.friend.delete({
    where: {
      initiator_friendId: {
        initiator: friendId,
        friendId: userId,
      },
    },
  });
  return true;
}

export {
  createFriendRequest,
  findFriendRequest,
  findAllFriend,
  acceptFriendRequest,
  declineFriendRequest,
};
