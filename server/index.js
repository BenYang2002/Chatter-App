import express from "express";
import { fileURLToPath } from "url";
import authRouter from "./routers/auth.routers.js";
import avatarRouter from "./routers/avatar.routers.js";
import path from "path";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.routers.js";
import friendRouter from "./routers/friend.router.js";
import userSummaryRouter from "./routers/userSummary.routers.js";
import conversationRouter from "./routers/conversations.routers.js";
import chatRouter from "./routers/chatMessage.routers.js";
import http from "http";
import { Server } from "socket.io";
import { use } from "react";
const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/avatar", avatarRouter);
app.use("/api/friend", friendRouter);
app.use("/api/userSummary", userSummaryRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/chat", chatRouter);
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, from: "express" });
});
const userPKMap = new Map();
const socketId = new Map();
app.set("io", io);
app.set("userPKMap", userPKMap);
io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);
  socket.on("register", ({ userPK }) => {
    userPKMap.set(userPK, socket.id);
    socketId.set(socket.id, userPK);
  });
  socket.on("disconnect", () => {
    console.log("a user disconnected:", socket.id);
    const pk = socketId.get(socket.id);
    socketId.delete(socket.id);
    userPKMap.delete(pk);
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;
