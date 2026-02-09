import bcrypt from "bcrypt";
import prisma from "../prisma.js";
import {
  verifyUser,
  checkCookie,
  handleInvalidCookie,
} from "../services/auth.service.js";
import { createUser, createUserTransaction } from "../services/user.service.js";
import {
  createSession,
  createSessionTransaction,
  deleteSession,
  updateSession,
  getSession,
} from "../services/session.service.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // todo: change this before deploy
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
      res.cookie("sessionId", session.sessionId, cookieOptions);
      res.status(200).json({ message: "Registration successful" });
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
  if (!cookieInfo.valid) {
    await handleInvalidCookie(
      cookieInfo,
      req.cookies.sessionId ? req.cookies.sessionId : null,
      res,
    );
  } else {
    try {
      await updateSession(req.cookies.sessionId);
      res.status(200).send({ message: "Authorized" });
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
