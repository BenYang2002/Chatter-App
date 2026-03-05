import {
  getCreationTime,
  createAvatarKey,
  updateAvatarKey,
} from "../services/avatar.service.js";
import { checkCookie } from "../services/auth.service.js";
import {
  getProfilePicPresignedGetUrl,
  getProfilePicPresignedPutUrl,
} from "../services/presignUrl.js";
import requireUser from "./helpers/requireUser.js";
import { getAvatarKey } from "../services/avatar.service.js";
import requireInputValue from "./helpers/requireInputValue.js";
async function checkProfilePicUpdated(req, res) {
  const remoteCreationTime = await getCreationTime(req.body.userPK);
  //console.log(remoteCreationTime);
  //console.log(req.body.localCreationTime);
  if (!remoteCreationTime) {
    res.status(404).send({ updated: false });
    return;
  } else if (
    req.body.localCreationTime === undefined ||
    remoteCreationTime > req.body.localCreationTime
  ) {
    res.status(200).send({ updated: true });
    return;
  }
  res.status(200).send({ updated: false });
}

async function getProfilePicUrl(req, res) {
  const cookieInfo = await checkCookie(req.cookies);
  if (cookieInfo.valid) {
    const url = await getProfilePicPresignedGetUrl(req.body.userPK);
    if (url) {
      res.status(200).json({ url: url });
    } else {
      res.status(404).send({ message: "Profile pic does not exist" });
    }
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}
async function handleChangeAvatar(req, res) {
  if (req.body.size === null || req.body.size <= 0) {
    res.status(400).send({ message: "invalid avatar" });
    return;
  }
  if (req.body.size > 3 * 1024 * 1024) {
    res.status(400).send({ message: "avatar file too large" });
    return;
  }
  if (
    req.body.contentType !== "image/jpeg" &&
    req.body.contentType !== "image/png" &&
    req.body.contentType !== "image/jpg"
  ) {
    res
      .status(400)
      .send({ message: "invalid file format, must be jpeg, png, or jpg" });
    return;
  }
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    const { signedUrl, key } = await getProfilePicPresignedPutUrl(
      req.body.contentType,
      user.id,
    );
    res.status(200).json({ signedUrl, key });
  } catch (err) {
    console.error("Error getting presigned url:", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function handleSaveAvatar(req, res) {
  const key = requireInputValue(req, res);
  if (!key) return;
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    const avatar = await getAvatarKey(user.id);
    let success = null;
    if (!avatar) {
      // avatar has not been created yet
      success = await createAvatarKey(user.id, key);
    } else {
      success = await updateAvatarKey(user.id, key);
    }
    if (!success) {
      res.status(500).send({ message: "Internal server error" });
      return;
    }
    res.status(200).send({ message: `avatar key created` });
    return;
  } catch (err) {
    console.error("Error changing avatar key:", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

export {
  checkProfilePicUpdated,
  getProfilePicUrl,
  handleChangeAvatar,
  handleSaveAvatar,
};
