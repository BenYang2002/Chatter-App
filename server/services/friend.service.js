import prisma from "../prisma.js";
import bcrypt from "bcrypt";
async function createFriendRequest(userId, friendId) {
  if (!userId || friendId) return null;
  const friendRequest = await prisma.friend.create({
    data: {
      userId: userId,
      friendId: friendId,
      state: "pending",
    },
  });
  return friendRequest;
}

export { createFriendRequest };
