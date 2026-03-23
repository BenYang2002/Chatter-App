import express from "express";
import {
  updateConversationName,
  updateConversationLastMessage,
  avatarHelper,
} from "../controllers/conversations.controller.js";
const router = express.Router();
router.post("/updateName", (req, res) => {
  updateConversationName(req, res);
});
router.post("/updateLastMessage", (req, res) => {
  updateConversationLastMessage(req, res);
});
router.post("/avatarHelper", (req, res) => {
  avatarHelper(req, res);
});
export default router;
