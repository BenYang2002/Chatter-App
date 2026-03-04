import { useEffect } from "react";
import "./UserHMSidebar.css";
import { useState } from "react";
import { getProfilePic } from "../Service/indexDB.js";
function UserHMSidebar({
  SetDisplaySetting,
  useDefaultAvatar,
  SetUseDefaultAvatar,
  avatarURL,
  SetAvatarURL,
  userProfile,
}) {
  useEffect(() => {
    (async () => {
      const email = localStorage.getItem("email");
      if (email) {
        const profilePic = await getProfilePic(email);
        if (profilePic) {
          const url = URL.createObjectURL(profilePic);
          SetUseDefaultAvatar(false);
          SetAvatarURL(url);
        } else {
          // get the url for the retrieving image
          const res = await fetch("/api/user/ProfilePic", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userPK: userProfile.userPK }),
          });
          if (res.ok) {
            const data = await res.json();
            const retrieveRes = await fetch(data.url, {
              method: "get",
            });
            if (retrieveRes.ok) {
              const img = await retrieveRes.blob();
              const url = URL.createObjectURL(img);
              SetUseDefaultAvatar(false);
              SetAvatarURL(url);
            } else {
              SetUseDefaultAvatar(true);
              SetAvatarURL("");
            }
          }
        }
      }
    })();
  }, []);

  return (
    <>
      <div className="sidebar">
        <div
          className="user-avatar"
          style={{
            backgroundImage: useDefaultAvatar
              ? 'url("src/assets/userpage/profile-default-avatar.png")'
              : `url(${avatarURL})`,
          }}
        ></div>
        <div className="chat-icon"></div>
        <div className="contact-icon"></div>
        <div
          className="setting-icon"
          onClick={() => SetDisplaySetting(true)}
        ></div>
      </div>
    </>
  );
}
export default UserHMSidebar;
