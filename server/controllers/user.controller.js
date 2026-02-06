import { getSession } from "../services/session.service.js";
import { checkCookie, handleInvalidCookie } from "../services/auth.service.js";
import { getUser, createUserId } from "../services/user.service.js";
async function handleCreateUserId(req, res) {
  const userId = req.body.inputValue;
  if (!userId) {
    res.status(400).send({ message: "UserId is required" });
    return;
  }
  const cookieInfo = await checkCookie(req.cookies);
  if (!cookieInfo.valid) {
    handleInvalidCookie(
      cookieInfo,
      req.cookies.sessionId ? req.cookies.sessionId : null,
      res,
    );
    return;
  }
  try {
    const session = await getSession(req.cookies.sessionId);
    if (!session) {
      res.status(500).send({ message: "Session does not exist" });
      return;
    }
    const user = await getUser(session.userPK);
    console.log(user);
    console.log(userId);
    if (!user) {
      res.status(500).send({ message: "User does not exist" });
      return;
    }
    const success = await createUserId(userId, user.id);
    if (success) {
      res.status(200).send({ message: `UserId created: ${userId}` });
    } else {
      res.status(409).send({ message: "UserId already exists" });
    }
  } catch (err) {
    console.error("Error creating UserId:", err);
    res.status(500).send({ message: "Internal server error" });
  }
}
export { handleCreateUserId };
