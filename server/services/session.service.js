import prisma from "../prisma.js";

async function createSession(userId) {
  const session = await prisma.session.create({
    data: {
      userPK: userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });
  return session;
}
async function deleteSession(sessionId) {
  await prisma.session.delete({ where: { sessionId: sessionId } });
}
async function updateSession(sessionId) {
  const session = await prisma.session.update({
    where: {
      sessionId: sessionId,
    },
    data: {
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });
}
async function getSession(sessionId) {
  const session = await prisma.session.findUnique({
    where: {
      sessionId: sessionId,
    },
  });
  return session;
}
export { createSession, deleteSession, updateSession, getSession };
