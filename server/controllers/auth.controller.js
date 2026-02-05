import bcrypt from "bcrypt";
import prisma from "../prisma.js";
import { verifyUser, checkCookie } from "../services/auth.service.js";
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
      res.status(200).send({ message: "Registration successful" });
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).send({ message: "Internal server error" });
    return false;
  }
  return true;
}

async function handleMe(req, res) {
  const cookieInfo = await checkCookie(req.cookies.sessionId);
  if (!cookieInfo.valid) {
    if (cookieInfo.expired) {
      await deleteSession(req.cookies.sessionId);
      res.status(401).send({ message: cookieInfo.message });
    } else res.status(cookieInfo.status).send({ message: cookieInfo.message });
    return;
  } else {
    await updateSession(req.cookies.sessionId);
    res.status(200).send({ message: "Authorized" });
  }
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
      } else {
        const newSession = await createSession(userInfo.id);
        res.cookie("sessionId", newSession.sessionId, cookieOptions);
      }
      res.status(200).send({ message: "Login successful" });
      return;
    } catch (err) {
      console.error("Error getting session:", err);
      res.status(500).send({ message: "Internal server error" });
      return;
    }
  }
}

export { handleRegister, handleLogin, handleMe };
