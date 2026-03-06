import express from "express";
import { fileURLToPath } from "url";
import authRouter from "./routers/auth.routers.js";
import avatarRouter from "./routers/avatar.routers.js";
import path from "path";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.routers.js";
import friendRouter from "./routers/friend.router.js";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/avatar", avatarRouter);
app.use("/api/friend", friendRouter);
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, from: "express" });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

export default app;
