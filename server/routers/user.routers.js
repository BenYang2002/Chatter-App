import { handleCreateUserId } from "../controllers/user.controller.js";
import express from "express";
const router = express.Router();
router.post("/createUserId", (req, res) => {
  handleCreateUserId(req, res);
});
export default router;
