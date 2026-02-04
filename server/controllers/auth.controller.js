import bcrypt from "bcrypt";
import prisma from "../prisma.js";
import { verifyUser } from "../services/auth.service.js";
import {
  createSession,
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
  const passwordHash = await bcrypt.hash(req.body.password, 12);
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
    prisma.$transaction(async (tx) => {
      const user = await prisma.user.create({
        data: {
          name: req.body.username,
          email: req.body.email,
          password: passwordHash,
        },
      });
      await prisma.session.create({
        data: {
          userPK: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });
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
  console.log("triggered");
  if (!req.cookies) {
    res.status(404).send({ message: "Unauthorized" });
  }
  const session = await getSession(req.cookies.sessionId);
  if (!session) {
    res.status(404).send({ message: "Unauthorized" });
    return;
  } else if (session.expiresAt < Date.now()) {
    await deleteSession(req.cookies.sessionId);
    res.status(401).send({ message: "Unauthorized" });
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
