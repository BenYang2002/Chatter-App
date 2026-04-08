import express from "express";
import { createNewMessage } from "../controllers/chatMessage.controller.js";
const router = express.Router();
router.post("/sendMessage", (req, res) => {
  createNewMessage(req, res);
});
export default router;
