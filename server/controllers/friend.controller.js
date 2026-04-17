import { getUserbyUserId } from "../services/user.service.js";
import { getProfilePicPresignedGetUrl } from "../services/presignUrl.js";
import { checkCookie, handleInvalidCookie } from "../services/auth.service.js";
import { getSession } from "../services/session.service.js";
import {
  createFriendRequest as createFriend,
  findFriendRequest,
} from "../services/friend.service.js";
import app from "../index.js";
import { use } from "react";
import {
  updateUSFriendRequest,
  pushFriendId,
  removeFriendId,
} from "../services/userSummary.service.js";
import {
  acceptFriendRequest as acceptFriend,
  declineFriendRequest as declineFriend,
} from "../services/friend.service.js";
import { createConversation } from "../services/conversation.service.js";
async function searchFriendProfile(req, res) {
  const cookieInfo = await checkCookie(req.cookies);
  if (!cookieInfo.valid) {
    handleInvalidCookie(
      cookieInfo,
      req.cookies.sessionId ? req.cookies.sessionId : null,
      res,
    );
    return;
  }
  const friendId = req.params.friendId;
  if (!friendId) {
    res.status(400).send({ message: "friendId is required" });
    return;
  }
  const friend = await getUserbyUserId(friendId);
  if (!friend || friend === undefined) {
    res.status(404).send({ message: "Friend does not exist" });
    return;
  } else {
    const urlFriendAvatar = await getProfilePicPresignedGetUrl(friend.id); // url to fetch avatar
    const name = friend.name;
    res.status(200).json({ name, urlFriendAvatar });
  }
}

async function declineFriendRequest(req, res) {
  const cookieInfo = await checkCookie(req.cookies);
  if (!cookieInfo.valid) {
    handleInvalidCookie(
      cookieInfo,
      req.cookies.sessionId ? req.cookies.sessionId : null,
      res,
    );
    return;
  }
  const friendId = req.params.friendId;
  if (!friendId) {
    res.status(400).send({ message: "friendId is required" });
    return;
  }
  const friend = await getUserbyUserId(friendId);
  if (!friend || friend === undefined) {
    res.status(404).send({ message: "Friend does not exist" });
    return;
  }
  const userId = req.body.userId;
  if (!userId) {
    res.status(400).send({ message: "userId is required" });
    return;
  }
  const user = await getUserbyUserId(userId);
  if (!user || user === undefined) {
    res.status(404).send({ message: "User does not exist" });
    return;
  }
  const friendRequest = await findFriendRequest(userId, friendId);
  if (!friendRequest || friendRequest === undefined) {
    res.status(404).send({ message: "Friend request does not exist" });
    return;
  }
  const success = await declineFriend(userId, friendId);
  if (success) {
    await removeFriendId(user.id, friendId);
    res.status(200).send({ message: "Friend request declined" });
  } else {
    res.status(500).send({ message: "Internal server error" });
  }
}

async function acceptFriendRequest(req, res) {
  const cookieInfo = await checkCookie(req.cookies);
  if (!cookieInfo.valid) {
    handleInvalidCookie(
      cookieInfo,
      req.cookies.sessionId ? req.cookies.sessionId : null,
      res,
    );
    return;
  }
  const friendId = req.params.friendId;
  if (!friendId) {
    res.status(400).send({ message: "friendId is required" });
    return;
  }
  const friend = await getUserbyUserId(friendId);
  if (!friend || friend === undefined) {
    res.status(404).send({ message: "Friend does not exist" });
    return;
  }
  const userId = req.body.userId;
  if (!userId) {
    res.status(400).send({ message: "userId is required" });
    return;
  }
  const user = await getUserbyUserId(userId);
  if (!user || user === undefined) {
    res.status(404).send({ message: "User does not exist" });
    return;
  }
  const friendRequest = await findFriendRequest(userId, friendId);
  if (!friendRequest || friendRequest === undefined) {
    res.status(404).send({ message: "Friend request does not exist" });
    return;
  }
  const success = await acceptFriend(userId, friendId);
  if (!success) {
    res.status(500).send({ message: "internal server error" });
    return;
  } else {
    // friend request is updated, now update the user summary
    await removeFriendId(user.id, friendId);
    // also create the conversation for the two users
    const lastMessage = "Friend request accepted, start messaging now!";
    const lastMessageDate = new Date().toISOString();
    const userPK = user.id;
    const friendPK = friend.id;
    const userName = user.name;
    const friendName = friend.name;
    await createConversation(
      userPK,
      friendPK,
      friendName,
      lastMessage,
      lastMessageDate,
    );
    await createConversation(
      friendPK,
      userPK,
      userName,
      lastMessage,
      lastMessageDate,
    );
    const notifyUser = app.get("userPKMap").get(userPK);
    const notifyFriend = app.get("userPKMap").get(friendPK);
    if (notifyUser) {
      app.get("io").to(notifyUser).emit("friendRequestAccepted", {
        friendName,
        lastMessage,
        lastMessageDate,
        friendId,
      });
    }
    if (notifyFriend) {
      app.get("io").to(notifyFriend).emit("friendRequestAccepted", {
        friendName: userName,
        lastMessage,
        lastMessageDate,
        friendId: userId,
      });
    }
    res.status(200).send({ message: "Friend request accepted" });
  }
}

async function createFriendRequest(req, res) {
  const cookieInfo = await checkCookie(req.cookies);
  if (req.body.userId === req.body.friendId) {
    res.status(400).send({ message: "Cannot send friend request to yourself" });
    return;
  }
  const existingRequest = await findFriendRequest(
    req.body.userId,
    req.body.friendId,
  );
  if (existingRequest) {
    res.status(400).send({ message: "Friend request already exists" });
    return;
  }
  if (!cookieInfo.valid) {
    handleInvalidCookie(
      cookieInfo,
      req.cookies.sessionId ? req.cookies.sessionId : null,
      res,
    );
    return;
  }
  const friendId = req.body.friendId;
  const userId = req.body.userId;
  const state = req.body.state;
  if (!friendId || !userId) {
    res.status(400).send({ message: "two userId is required" });
    return;
  }
  const friend = await getUserbyUserId(friendId);
  const user = await getUserbyUserId(userId);
  if (!user || user === undefined || !friend || friend === undefined) {
    res.status(404).send({ message: "User does not exist" });
    return;
  } else {
    const friendRequest = await createFriend(userId, friendId, state);
    if (friendRequest) {
      const targetFriend = app.get("userPKMap").get(friend.id);
      if (targetFriend) {
        // friend is online currently
        app.get("io").to(targetFriend).emit("friendRequest", { userId });
      }
      await pushFriendId(friend.id, user.userId); // add id for friend
      const addFriendSummary = await updateUSFriendRequest(friend.id, true);
      if (!addFriendSummary) {
        res.status(500).send({ message: "Internal server error" });
        return;
      }
      res.status(200).end();
    }
  }
}
export {
  searchFriendProfile,
  createFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
};
