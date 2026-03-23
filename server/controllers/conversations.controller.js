import { checkCookie, handleInvalidCookie } from "../services/auth.service.js";
import {
  updateConversationName as updateName,
  updateConversationLastMessage as updateLastMessage,
} from "../services/conversation.service.js";
import { getUserbyUserId } from "../services/user.service.js";
import { getProfilePicPresignedGetUrl } from "../services/presignUrl.js";
async function updateConversationName(req, res) {
  const cookieInfo = await checkCookie(req.cookies);
  if (!cookieInfo.valid) {
    handleInvalidCookie(
      cookieInfo,
      req.cookies.sessionId ? req.cookies.sessionId : null,
      res,
    );
    return;
  }

  const { userPK, friendPK, friendName } = req.body;
  if (!userPK || !friendPK || !friendName) {
    res.status(400).send({ message: "userPK, friendPK, friendName required" });
    return;
  }

  const updated = await updateName(userPK, friendPK, friendName);
  if (!updated)
    return res.status(500).send({ message: "Internal server error" });
  res.status(200).json(updated);
}

async function updateConversationLastMessage(req, res) {
  const cookieInfo = await checkCookie(req.cookies);
  if (!cookieInfo.valid) {
    handleInvalidCookie(
      cookieInfo,
      req.cookies.sessionId ? req.cookies.sessionId : null,
      res,
    );
    return;
  }

  const { userPK, friendPK, lastMessage, lastMessageDate } = req.body;
  if (!userPK || !lastMessage || !lastMessageDate) {
    res.status(400).send({
      message: "userPK, friendPK, lastMessage, lastMessageDate required",
    });
    return;
  }

  const updated = await updateLastMessage(
    userPK,
    friendPK,
    lastMessage,
    lastMessageDate,
  );
  if (!updated)
    return res.status(500).send({ message: "Internal server error" });
  res.status(200).json(updated);
}

async function avatarHelper(req, res) {
  const cookieInfo = await checkCookie(req.cookies);
  if (!cookieInfo.valid) {
    handleInvalidCookie(
      cookieInfo,
      req.cookies.sessionId ? req.cookies.sessionId : null,
      res,
    );
    return;
  }
  const userPK = req.body.userPK;
  const friendId = req.body.friendId;
  if (!userPK || !friendId) {
    res.status(400).send({ message: "userPK and friendId are required" });
    return;
  }
  const friend = await getUserbyUserId(friendId);
  if (!friend || friend === undefined) {
    res.status(404).send({ message: "Friend does not exist" });
    return;
  }
  const friendPK = friend.id;
  const url = await getProfilePicPresignedGetUrl(friendPK);
  if (url) {
    res.status(200).json({ url: url });
  } else {
    res.status(404).send({ message: "Profile pic does not exist" });
  }
}

export { updateConversationName, updateConversationLastMessage, avatarHelper };
