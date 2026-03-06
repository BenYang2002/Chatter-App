import { getUserbyUserId } from "../services/user.service.js";
import { getProfilePicPresignedGetUrl } from "../services/presignUrl.js";
async function searchFriendProfile(req, res) {
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
export { searchFriendProfile };
