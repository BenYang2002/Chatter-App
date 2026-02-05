import {
  handleRegister,
  handleLogin,
  handleMe,
} from "../controllers/auth.controller.js";
import express from "express";
const router = express.Router();
router.post("/register", (req, res) => {
  handleRegister(req, res);
});

router.post("/login", (req, res) => {
  handleLogin(req, res);
});

router.get("/me", (req, res) => {
  handleMe(req, res);
});

export default router;
