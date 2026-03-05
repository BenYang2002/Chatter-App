import express from "express";
import {
  getProfilePicUrl,
  handleChangeAvatar,
  handleSaveAvatar,
  checkProfilePicUpdated,
} from "../controllers/avatar.controller.js";

const router = express.Router();
router.post("/profilePic", (req, res) => {
  getProfilePicUrl(req, res);
});
router.post("/changeAvatar", (req, res) => {
  handleChangeAvatar(req, res);
});
router.post("/saveAvatar", (req, res) => {
  handleSaveAvatar(req, res);
});
router.post("/checkAvatar", (req, res) => {
  checkProfilePicUpdated(req, res);
});

export default router;
