import { useEffect } from "react";
import "./UserHMSidebar.css";
import { useState } from "react";
import {
  getProfilePic,
  getProfilePicTime,
  saveProfilePic,
  deleteProfilePicTime,
  deleteProfilePic,
} from "../Service/indexDB.js";
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
      if (userProfile.userPK) {
        const profilePic = await getProfilePic(userProfile.userPK);
        if (profilePic) {
          // check if there's a local avatar
          const url = URL.createObjectURL(profilePic);
          SetUseDefaultAvatar(false);
          SetAvatarURL(url);
        }
        const localUpdatedTime = await getProfilePicTime(userProfile.userPK);
        const updatedRes = await fetch("/api/avatar/checkAvatar", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userPK: userProfile.userPK,
            localCreationTime: localUpdatedTime,
          }),
        });
        const updatedData = await updatedRes.json();
        console.log(updatedData);
        if (updatedRes.ok && updatedData.updated) {
          await deleteProfilePicTime(userProfile.userPK);
          await deleteProfilePic(userProfile.userPK);
          // the local version needs to be updated
          // get the url for the retrieving image
          const res = await fetch("/api/avatar/ProfilePic", {
            // retrieve the url to get the image
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userPK: userProfile.userPK }),
          });
          if (res.ok) {
            const data = await res.json();
            const retrieveRes = await fetch(data.url, {
              // getting the actual image
              method: "get",
            });
            if (retrieveRes.ok) {
              const img = await retrieveRes.blob();
              await saveProfilePic(userProfile.userPK, img);
              const url = URL.createObjectURL(img);
              SetUseDefaultAvatar(false);
              SetAvatarURL(url);
            } else {
              SetUseDefaultAvatar(true);
              SetAvatarURL("");
            }
          } else {
            SetUseDefaultAvatar(true);
            SetAvatarURL("");
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
