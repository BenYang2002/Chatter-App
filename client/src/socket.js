import { io } from "socket.io-client";

const IO_URL = import.meta.env.VITE_IO_URL || "http://localhost:3000";

const socket = io(IO_URL, {
  withCredentials: true,
});

export default socket;
