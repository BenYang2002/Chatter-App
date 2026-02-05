import { getSession } from "../services/session.service.js";
async function handleCreateUserId() {
  if (!req.cookies) {
    res.status(404).send({ message: "Cookies not found" });
  }
  const sessionId = req.cookies.sessinId;
  const session = await getSession(sessionId);
  if (!session) {
    res.status(404).send({ message: "Session not found" });
    return;
  } else {
    session.userPK;
  }
}
export { handleCreateUserId };
