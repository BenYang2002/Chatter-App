import bcrypt from "bcrypt";
import prisma from "../prisma.js";
import {
  verifyUser,
  checkCookie,
  handleInvalidCookie,
} from "../services/auth.service.js";
import {
  createUser,
  createUserTransaction,
  getUser,
} from "../services/user.service.js";
import {
  createSession,
  createSessionTransaction,
  deleteSession,
  updateSession,
  getSession,
} from "../services/session.service.js";
import { createUserSummaryTransaction } from "../services/userSummary.service.js";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
};
async function handleRegister(req, res) {
  try {
    const existingEmail = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (existingEmail) {
      res.status(409).send({ message: "Email already exists" });
      return false;
    }
  } catch (err) {
    console.error("Error checking existing email:", err);
    res.status(500).send({ message: "Internal server error" });
    return false;
  }

  try {
    await prisma.$transaction(async (tx) => {
      const user = await createUserTransaction(
        tx,
        req.body.username,
        req.body.email,
        req.body.password,
      );
      if (!user) {
        res.status(500).send({ message: "Internal server error" });
        return false;
      }
      const session = await createSessionTransaction(tx, user.id);
      if (!session) {
        res.status(500).send({ message: "Internal server error" });
        return false;
      }
      const userSummary = await createUserSummaryTransaction(tx, user.id);
      if (!userSummary) {
        res.status(500).send({ message: "Internal server error" });
        return false;
      }
      res.cookie("sessionId", session.sessionId, cookieOptions);
      res.status(200).json({
        message: "Registration successful",
        userPK: user.id,
        userId: user.userId,
      });
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).send({ message: "Internal server error" });
    return false;
  }
  return true;
}

async function handleMe(req, res) {
  const cookieInfo = await checkCookie(req.cookies);
  const session = await getSession(req.cookies.sessionId);
  if (!session) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  const user = await getUser(session.userPK);
  if (!cookieInfo.valid) {
    await handleInvalidCookie(
      cookieInfo,
      req.cookies.sessionId ? req.cookies.sessionId : null,
      res,
    );
  } else {
    try {
      await updateSession(req.cookies.sessionId);
      const userInfo = {
        name: user.name,
        email: user.email,
        userId: user.userId,
        userPK: user.id,
      };
      res.status(200).send({ message: "Authorized", user: userInfo });
    } catch (err) {
      console.error("Error updating session:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  }
  return;
}

async function handleLogin(req, res) {
  const verified = await verifyUser(req);
  if (!verified.verified) {
    res.status(verified.status).json({ message: verified.message });
    return;
  } else {
    // user is verified
    try {
      const userInfo = await prisma.user.findUnique({
        where: {
          email: verified.user.email,
        },
      });
      const session = await prisma.session.findFirst({
        where: {
          userPK: userInfo.id,
        },
      });
      if (session) {
        const sessionId = session.sessionId;
        await updateSession(sessionId);
        res.cookie("sessionId", sessionId, cookieOptions);
      } else {
        const newSession = await createSession(userInfo.id);
        res.cookie("sessionId", newSession.sessionId, cookieOptions);
      }
      res.status(200).json({
        message: "Login successful",
        userId: userInfo.userId,
        name: userInfo.name,
        email: userInfo.email,
        userPK: userInfo.id,
      });
      return;
    } catch (err) {
      console.error("Error getting session:", err);
      res.status(500).send({ message: "Internal server error" });
      return;
    }
  }
}

export { handleRegister, handleLogin, handleMe };
