import express from "express";
import {
  searchFriendProfile,
  createFriendRequest,
} from "../controllers/friend.controller.js";
const router = express.Router();
router.get("/search/:friendId", (req, res) => {
  searchFriendProfile(req, res);
});
router.post("/create", (req, res) => {
  createFriendRequest(req, res);
});
export default router;
