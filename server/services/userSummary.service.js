import prisma from "../prisma.js";
async function createUserSummaryTransaction(db, userPK) {
  if (!userPK) return null;
  const userSummary = await db.userSummary.create({
    data: {
      userPK: userPK,
    },
  });
  return userSummary;
}

async function getUserSummary(userPK) {
  if (!userPK) return null;
  const userSummary = await prisma.userSummary.findUnique({
    where: {
      userPK: userPK,
    },
  });
  return userSummary;
}

async function pushFriendId(userPK, newFriendId) {
  if (!userPK || !newFriendId) return null;
  await prisma.userSummary.update({
    where: { userPK },
    data: {
      friendId: {
        push: newFriendId,
      },
    },
  });
}

async function removeFriendId(userPK, newFriendId) {
  const summary = await prisma.userSummary.findUnique({
    where: { userPK },
    select: { friendId: true },
  });
  const updated = (summary?.friendId || []).filter((id) => id !== newFriendId);
  await prisma.userSummary.update({
    where: { userPK },
    data: {
      friendId: {
        set: updated,
      },
    },
  });
}

async function updateUSFriendRequest(userPK, newFriendRequest) {
  if (!userPK || !newFriendRequest) return null;
  const userSummary = await prisma.userSummary.update({
    where: {
      userPK: userPK,
    },
    data: {
      newFriendRequest: newFriendRequest,
    },
  });
  return userSummary;
}

export {
  createUserSummaryTransaction,
  getUserSummary,
  updateUSFriendRequest,
  pushFriendId,
  removeFriendId,
};
