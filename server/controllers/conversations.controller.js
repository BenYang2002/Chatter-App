import { checkCookie, handleInvalidCookie } from "../services/auth.service.js";
import {
  updateConversationName as updateName,
  updateConversationLastMessage as updateLastMessage,
  getFriendPK,
  getLastMessageInfo,
} from "../services/conversation.service.js";
import { getUserbyUserId, getUser } from "../services/user.service.js";
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

async function initializeConversations(req, res) {
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
  if (!userPK) {
    res.status(400).send({ message: "userPK is required" });
    return;
  }
  const friendPKList = await getFriendPK(userPK);
  if (!friendPKList) {
    res.status(500).send({ message: "Internal server error" });
    return;
  }
  if (friendPKList.length === 0) return res.status(200).json([]);
  // grab url, name and last message as well as date for each
  const friendList = [];
  for (const pk of friendPKList) {
    const friend = await getUser(pk);
    if (!friend || friend === undefined) {
      continue;
    }
    const url = await getProfilePicPresignedGetUrl(pk); // url to fetch avatar
    const name = friend.name;
    const friendId = friend.userId;
    const { lastMessage, lastMessageDate } = await getLastMessageInfo(
      userPK,
      pk,
    );
    friendList.push({ url, name, lastMessage, lastMessageDate, friendId });
  }
  res.status(200).json({ friendList });
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

export {
  updateConversationName,
  updateConversationLastMessage,
  avatarHelper,
  initializeConversations,
};
