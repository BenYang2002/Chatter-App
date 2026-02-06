import {
  checkCookie,
  handleInvalidCookie,
} from "../../services/auth.service.js";
import { getSession } from "../../services/session.service.js";
import { getUser } from "../../services/user.service.js";
async function requireUser(req, res) {
  const cookieInfo = await checkCookie(req.cookies);
  if (!cookieInfo.valid) {
    handleInvalidCookie(
      cookieInfo,
      req.cookies.sessionId ? req.cookies.sessionId : null,
      res,
    );
    return null;
  }
  try {
    const session = await getSession(req.cookies.sessionId);
    if (!session) {
      res.status(500).send({ message: "Session does not exist" });
      return null;
    }
    const user = await getUser(session.userPK);
    if (!user) {
      res.status(500).send({ message: "User does not exist" });
      return null;
    }
    return user;
  } catch (err) {
    console.error("Error creating UserId:", err);
    res.status(500).send({ message: "Internal server error" });
  }
}
export default requireUser;
