import { createNewMessage as createMessage } from "../services/chatMessage.service.js";
import { checkCookie, handleInvalidCookie } from "../services/auth.service.js";
import { getUserbyUserId, getUser } from "../services/user.service.js";
import { getSession } from "../services/session.service.js";
import { findAllFriend } from "../services/friend.service.js";
import { getChatHistory as getMessages } from "../services/chatMessage.service.js";
import app from "../index.js";
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
  const user = await getUser(userPK);
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
  if (!message) {
    res.status(404).send({ message: "Failed to create message" });
    return;
  } else {
    const friendSocketId = app.get("userPKMap").get(friendPK);
    app
      .get("io")
      .to(friendSocketId)
      .emit("receiveMessage", {
        message: {
          senderId: user.userId,
          content: content,
          type: type,
          createAt: creationTime,
        },
      });
    res.status(200).send();
    return;
  }
}

async function getChatHistory(req, res) {
  const cookieInfo = await checkCookie(req.cookies);
  if (!cookieInfo.valid) {
    handleInvalidCookie(
      cookieInfo,
      req.cookies.sessionId ? req.cookies.sessionId : null,
      res,
    );
    return;
  }
  const sessionId = req.cookies.sessionId;
  const session = await getSession(sessionId);
  const user = await getUser(session.userPK);
  if (!user) {
    res.status(404).send({ message: "User not found" });
    return;
  }
  const allFriends = await findAllFriend(user.userId);
  const friendIdList = allFriends.map((friend) =>
    friend.initiator === user.userId ? friend.friendId : friend.initiator,
  );
  let friendList = [];
  for (const friendId of friendIdList) {
    const friend = await getUserbyUserId(friendId);
    if (friend) {
      friendList.push(friend);
    }
  }
  let messages = [];
  for (const friend of friendList) {
    const message = await getMessages(user.id, friend.id);
    let friendMessages = [];
    for (const msg of message) {
      const senderId = msg.senderPK === user.id ? user.id : friend.userId;
      friendMessages.push({
        content: msg.content,
        msgMeta: {
          type: msg.type,
          createAt: msg.createAt,
          senderId: senderId,
        },
      });
    }
    messages.push({
      friendId: friend.userId,
      messages: friendMessages,
    });
  }
  //console.log("Chat history retrieved:", messages);
  res.status(200).json({ messages: messages });
}

export { createNewMessage, getChatHistory };
