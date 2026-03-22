import express from "express";
import { updateUserSummaryNFR } from "../controllers/userSummary.controller.js";
const router = express.Router();
router.post("/updateNFR", (req, res) => {
  updateUserSummaryNFR(req, res);
});

export default router;
