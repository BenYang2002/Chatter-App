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
  await prisma.user.delete({ where: { userPK: userPK } });
}

async function updateUserName(userPK, username) {
  if (!userPK || !username) return null;
  const user = await prisma.session.update({
    where: {
      userPK: userPK,
    },
    data: {
      name: username,
    },
  });
  return user;
}

async function updateUserEmail(userPK, email) {
  if (!userPK || !email) return null;
  const user = await prisma.session.update({
    where: {
      userPK: userPK,
    },
    data: {
      email: email,
    },
  });
  return user;
}

async function updateUserPassword(userPK, password) {
  if (!userPK || !password) return null;
  const user = await prisma.session.update({
    where: {
      userPK: userPK,
    },
    data: {
      password: password,
    },
  });
  return user;
}

async function getUser(userPK) {
  if (!userPK) return null;
  const user = await prisma.user.findUnique({
    where: {
      userPK: userPK,
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
};
