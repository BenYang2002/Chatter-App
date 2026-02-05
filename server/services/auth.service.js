import prisma from "../prisma.js";
import bcrypt from "bcrypt";
import { getSession } from "./session.service.js";
async function verifyUser(req) {
  const returnValue = {
    verified: false,
    message: "",
    status: 200,
    user: {},
  };
  const data = req.body;
  try {
    returnValue.user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
  } catch (err) {
    returnValue.message = "Internal server error";
    returnValue.status = 500;
    console.error(err);
    return returnValue;
  }

  if (!returnValue.user) {
    //user does not exist
    returnValue.message = "User not found";
    returnValue.status = 404;
    return returnValue;
  } else {
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      returnValue.user.password,
    );
    if (isPasswordCorrect) {
      returnValue.verified = true;
      returnValue.message = `Welcome: ${returnValue.user.name}`;
    } else {
      returnValue.message = "Incorrect password";
      returnValue.status = 401;
    }
    return returnValue;
  }
}

async function checkCookie(sessionId) {
  const cookieInfo = { valid: false, expired: false, message: "", status: 404 };
  if (!sessionId) {
    cookieInfo.message = "Cookie not found";
    return cookieInfo;
  }
  const session = await getSession(sessionId);
  if (!session) {
    cookieInfo.message = "Session not found";
    return cookieInfo;
  }
  if (session.expiresAt < Date.now()) {
    cookieInfo.message = "Session expired";
    cookieInfo.expired = true;
    cookieInfo.status = 401;
    return cookieInfo;
  }
  cookieInfo.valid = true;
  cookieInfo.status = 200;
  return cookieInfo;
}

export { verifyUser, checkCookie };
