import express from "express";
import { searchFriendProfile } from "../controllers/friend.controller.js";
const router = express.Router();
router.get("/search/:friendId", (req, res) => {
  searchFriendProfile(req, res);
});

export default router;
