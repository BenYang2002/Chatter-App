import express from "express";
import {
  searchFriendProfile,
  createFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} from "../controllers/friend.controller.js";
const router = express.Router();
router.get("/search/:friendId", (req, res) => {
  searchFriendProfile(req, res);
});
router.post("/create", (req, res) => {
  createFriendRequest(req, res);
});
router.post("/accept/:friendId", (req, res) => {
  acceptFriendRequest(req, res);
});
router.post("/decline/:friendId", (req, res) => {
  declineFriendRequest(req, res);
});
export default router;
