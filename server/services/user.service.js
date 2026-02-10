import prisma from "../prisma.js";
import bcrypt from "bcrypt";
async function createUser(username, email, password) {
  if (!username || !email || !password) return null;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name: username,
      email: email,
      password: passwordHash,
    },
  });
  return user;
}

async function createUserTransaction(db, username, email, password) {
  if (!username || !email || !password) return null;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: {
      name: username,
      email: email,
      password: passwordHash,
    },
  });
  return user;
}

async function deleteUser(userPK) {
  if (!userPK) return null;
  await prisma.user.delete({ where: { id: userPK } });
}

async function updateUserName(userPK, username) {
  if (!userPK || !username) return null;
  const user = await prisma.user.update({
    where: {
      id: userPK,
    },
    data: {
      name: username,
    },
  });
  return user;
}

async function updateUserEmail(userPK, email) {
  if (!userPK || !email) return null;
  const user = await prisma.user.update({
    where: {
      id: userPK,
    },
    data: {
      email: email,
    },
  });
  return user;
}

async function updateUserPassword(userPK, password) {
  if (!userPK || !password) return null;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.update({
    where: {
      id: userPK,
    },
    data: {
      password: passwordHash,
    },
  });
  return user;
}

async function getUser(userPK) {
  if (!userPK) return null;
  const user = await prisma.user.findUnique({
    where: {
      id: userPK,
    },
  });
  return user;
}

async function createUserId(userId, userPK) {
  if (!userId || !userPK) return false;
  const duplicate = await prisma.user.findUnique({ where: { id: userId } });
  if (duplicate) return false;
  const user = await prisma.user.update({
    where: {
      id: userPK,
    },
    data: {
      userId: userId,
    },
  });
  return user;
}

async function updateAvatarKey(userPK, key) {
  if (!userPK || !key) return null;
  const user = await prisma.user.update({
    where: {
      id: userPK,
    },
    data: {
      avatarKey: key,
    },
  });
  return user;
}

export {
  createUser,
  createUserTransaction,
  deleteUser,
  updateUserName,
  updateUserEmail,
  updateUserPassword,
  getUser,
  createUserId,
  updateAvatarKey,
};
