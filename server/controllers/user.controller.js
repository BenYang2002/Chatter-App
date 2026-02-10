import { getSession } from "../services/session.service.js";
import { checkCookie, handleInvalidCookie } from "../services/auth.service.js";
import {
  getUser,
  createUserId,
  updateUserName,
  updateUserEmail,
  updateUserPassword,
  updateAvatarKey,
} from "../services/user.service.js";
import requireUser from "./helpers/requireUser.js";
import bcrypt from "bcrypt";
import requireInputValue from "./helpers/requireInputValue.js";
import getPresignedUrl from "../services/presignUrl.js";
async function handleCreateUserId(req, res) {
  const userId = requireInputValue(req, res);
  if (!userId) {
    res.status(400).send({ message: "UserId is required" });
    return;
  }
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    const success = await createUserId(userId, user.id);
    if (success) {
      res.status(200).send({ message: `UserId created: ${userId}` });
    } else {
      res.status(409).send({ message: "UserId already exists" });
    }
  } catch (err) {
    console.error("Error creating UserId:", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function handleChangeName(req, res) {
  const userName = requireInputValue(req, res);
  if (!userName) return;
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    await updateUserName(user.id, userName);
    res.status(200).send({ message: `UserName changed: ${userName}` });
  } catch (err) {
    console.error("Error changing UserName:", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function handleChangeEmail(req, res) {
  const email = requireInputValue(req, res);
  if (!email) return;
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    await updateUserEmail(user.id, email);
    res.status(200).send({ message: `Email changed: ${email}` });
  } catch (err) {
    console.error("Error changing Email:", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function handleConfirmPassword(req, res) {
  const password = requireInputValue(req, res);
  if (!password) return;
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).send({ message: "Incorrect password" });
    } else {
      res.status(200).send({ message: `Password matched` });
    }
  } catch (err) {
    console.error("Error changing Password:", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function handleChangePassword(req, res) {
  const password = requireInputValue(req, res);
  if (!password) return;
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    await updateUserPassword(user.id, password);
    res.status(200).send({ message: `Password changed: ${password}` });
  } catch (err) {
    console.error("Error changing Password:", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function handleChangeAvatar(req, res) {
  if (req.body.size === null || req.body.size <= 0) {
    res.status(400).send({ message: "invalid avatar" });
    return;
  }
  if (req.body.size > 3 * 1024 * 1024) {
    res.status(400).send({ message: "avatar file too large" });
    return;
  }
  if (
    req.body.contentType !== "image/jpeg" &&
    req.body.contentType !== "image/png" &&
    req.body.contentType !== "image/jpg"
  ) {
    res
      .status(400)
      .send({ message: "invalid file format, must be jpeg, png, or jpg" });
    return;
  }
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    const { signedUrl, key } = await getPresignedUrl(
      req.body.contentType,
      user.id,
    );
    res.status(200).json({ signedUrl, key });
  } catch (err) {
    console.error("Error getting presigned url:", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function handleSaveAvatar(req, res) {
  const key = requireInputValue(req, res);
  if (!key) return;
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    const success = await updateAvatarKey(user.id, key);
    if (!success) {
      res.status(500).send({ message: "Internal server error" });
      return;
    }
    res.status(200).send({ message: `avatar key updated` });
  } catch (err) {
    console.error("Error changing avatar key:", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

export {
  handleCreateUserId,
  handleChangeName,
  handleChangeEmail,
  handleConfirmPassword,
  handleChangePassword,
  handleChangeAvatar,
  handleSaveAvatar,
};
