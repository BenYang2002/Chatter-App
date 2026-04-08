import { createNewMessage as createMessage } from "../services/chatMessage.service.js";
import { checkCookie, handleInvalidCookie } from "../services/auth.service.js";
import { getUserbyUserId } from "../services/user.service.js";
async function createNewMessage(req, res) {
  const { userPK, receiverId, content, type, creationTime } = req.body;
  const cookieInfo = await checkCookie(req.cookies);
  if (!cookieInfo.valid) {
    handleInvalidCookie(
      cookieInfo,
      req.cookies.sessionId ? req.cookies.sessionId : null,
      res,
    );
    return;
  }
  console.log("Receiver ID:", content);
  const friend = await getUserbyUserId(receiverId);
  if (!friend) {
    res.status(404).send({ message: "Receiver not found" });
    return;
  }
  const friendPK = friend.id;
  const message = await createMessage(
    userPK,
    friendPK,
    content,
    type,
    creationTime,
  );
  console.log("Message created:", message);
  if (!message) {
    res.status(404).send({ message: "Failed to create message" });
    return;
  } else {
    res.status(200).send();
    return;
  }
}

export { createNewMessage };
