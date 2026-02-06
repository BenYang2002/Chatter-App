import {
  handleCreateUserId,
  handleChangeName,
  handleChangeEmail,
  handleChangePassword,
  handleConfirmPassword,
} from "../controllers/user.controller.js";
import express from "express";
const router = express.Router();
router.post("/createUserId", (req, res) => {
  handleCreateUserId(req, res);
});
router.post("/changeName", (req, res) => {
  handleChangeName(req, res);
});
router.post("/changeEmail", (req, res) => {
  handleChangeEmail(req, res);
});
router.post("/confirmPassword", (req, res) => {
  handleConfirmPassword(req, res);
});
router.post("/changePassword", (req, res) => {
  handleChangePassword(req, res);
});
export default router;
