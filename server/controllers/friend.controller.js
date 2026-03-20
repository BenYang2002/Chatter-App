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
import { updateUSFriendRequest } from "../services/userSummary.service.js";
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
      console.log("friend: " + friend.id);
      const targetFriend = app.get("userPKMap").get(friend.id);
      if (targetFriend) {
        // friend is online currently
        app
          .get("io")
          .to(targetFriend)
          .emit("friendRequest", { userId, userPK: user.id });
      } else {
        // store in userSummary if not currently online
        const addFriendSummary = await updateUSFriendRequest(friend.id, true);
        if (!addFriendSummary) {
          res.status(500).send({ message: "Internal server error" });
          return;
        }
      }
      res.status(200).end();
    }
  }
}
export { searchFriendProfile, createFriendRequest };
