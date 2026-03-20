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

export { createUserSummaryTransaction, getUserSummary, updateUSFriendRequest };
