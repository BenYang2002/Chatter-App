import express from 'express';
import { fileURLToPath } from 'url';
import authRouter from "./routers/auth.routers.js";
import path from 'path';
const app = express();
const PORT = 3000;
app.use(express.json());
app.use("/api/auth", authRouter);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname,'../client/dist')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

export default app;