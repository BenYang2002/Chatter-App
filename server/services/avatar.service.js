import prisma from "../prisma.js";
async function createAvatarKey(userPK, key) {
  if (!userPK || !key) return null;
  const avatar = await prisma.avatar.create({
    data: {
      userPK: userPK,
      key: key,
    },
  });
  return avatar;
}
async function getAvatarKey(userPK) {
  if (!userPK) return null;
  const avatar = await prisma.avatar.findUnique({
    where: {
      userPK: userPK,
    },
  });
  return avatar;
}

async function updateAvatarKey(userPK, key) {
  if (!userPK || !key) return null;
  const avatar = await prisma.avatar.update({
    where: {
      userPK: userPK,
    },
    data: {
      key: key,
    },
  });
  return avatar;
}

export { createAvatarKey, getAvatarKey, updateAvatarKey };
