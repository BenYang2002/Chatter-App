import { useState } from "react";
function UserProfile() {
  const [userProfile, SetUserProfile] = useState(() => {
    const getAvatarKey = localStorage.getItem("avatarKey");
    const getName = localStorage.getItem("name");
    const getEmail = localStorage.getItem("email");
    const getUserId = localStorage.getItem("userId");

    const avatarKey = getAvatarKey ? getAvatarKey : null;
    const name = getName ? getName : null;
    const email = getEmail ? getEmail : null;
    const userId = getUserId ? getUserId : null;

    return {
      avatarKey: avatarKey,
      name: name,
      email: email,
      userId: userId,
    };
  });
  return { userProfile, SetUserProfile };
}

export default UserProfile;
