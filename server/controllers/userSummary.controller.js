import { updateUSFriendRequest } from "../services/userSummary.service.js";
import { checkCookie, handleInvalidCookie } from "../services/auth.service.js";
async function updateUserSummaryNFR(req, res) {
  console.log("triggered");
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
  console.log("userPK", userPK);
  const result = await updateUSFriendRequest(userPK, false);
  console.log("result", result);
  if (result) {
    res.status(200).send();
  } else {
    res.status(500).send({ message: "Internal server error" });
  }
}

export { updateUserSummaryNFR };
