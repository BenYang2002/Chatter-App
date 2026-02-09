import { getSession } from "../services/session.service.js";
import { checkCookie, handleInvalidCookie } from "../services/auth.service.js";
import {
  getUser,
  createUserId,
  updateUserName,
  updateUserEmail,
  updateUserPassword,
} from "../services/user.service.js";
import requireUser from "./helpers/requireUser.js";
import bcrypt from "bcrypt";
import requireInputValue from "./helpers/requireInputValue.js";
async function handleCreateUserId(req, res) {
  const userId = requireInputValue(req, res);
  if (!userId) return;
  try {
    const user = await requireUser(req, res);
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
    updateUserName(user.id, userName);
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
    updateUserEmail(user.id, email);
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
    updateUserPassword(user.id, password);
    res.status(200).send({ message: `Password changed: ${password}` });
  } catch (err) {
    console.error("Error changing Password:", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

export {
  handleCreateUserId,
  handleChangeName,
  handleChangeEmail,
  handleConfirmPassword,
  handleChangePassword,
};
