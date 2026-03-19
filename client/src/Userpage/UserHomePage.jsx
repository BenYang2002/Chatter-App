import "./UserHomePage.css";
import UserHMChatContent from "./UserHMChatContent";
import UserHMContact from "./UserHMContact";
import UserHMSidebar from "./UserHMSidebar";
import UserSetting from "./Setting/UserSetting";
import FriendPage from "./UserFriend.jsx";
import { useEffect, useState } from "react";
import socket from "../socket.js";
function UserHomePage({ userProfile, SetUserProfile }) {
  const [displaySetting, SetDisplaySetting] = useState(false);
  const [avatarURL, SetAvatarURL] = useState("");
  const [useDefaultAvatar, SetUseDefaultAvatar] = useState(true);
  const [showFriendPage, SetShowFriendPage] = useState(true);
  const [incomingFriendRequest, SetIncomingFriendRequest] = useState([]);
  useEffect(() => {
    console.log(userProfile.userPK);
    socket.emit("register", { userPK: userProfile.userPK });
    const handleFriend = async ({ userId, userPK }) => {
      console.log("friend request");
      console.log(userId, userPK);
      await getFriendProfile(userPK);
    };
    socket.on("friendRequest", handleFriend);
    return () => {
      socket.off("friendRequest", handleFriend);
    };
  }, []);
  async function getFriendProfile(userPK) {
    const res = await fetch("/api/avatar/profilePic", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPK: userPK }),
    });
    if (res.status === 200) {
      const data = await res.json();
      const url = data.url;
      const resName = await fetch("/api/user/getUserName", {
        method: "GET",
        credentials: "include",
      });
      if (resName.status === 200) {
        const nameData = await resName.json();
        console.log("name", resName);
        console.log(nameData);
        const resId = await fetch("/api/user/getUserId", {
          method: "GET",
          credentials: "include",
        });
        if (resId.status === 200) {
          const id = await resId.json();
          const res = await fetch(url, { method: "GET" });
          if (res.ok) {
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const friend = { url: url, name: nameData.name, id: id };
            console.log(friend);
            SetIncomingFriendRequest((prev) => [...prev, friend]);
          }
        }
      }
    }
  }
  return (
    <>
      <div className="userPage-container">
        {displaySetting && (
          <UserSetting
            SetDisplaySetting={SetDisplaySetting}
            useDefaultAvatar={useDefaultAvatar}
            avatarURL={avatarURL}
            SetAvatarURL={SetAvatarURL}
            SetUseDefaultAvatar={SetUseDefaultAvatar}
            userProfile={userProfile}
            SetUserProfile={SetUserProfile}
          />
        )}
        <div className="userPage-chat-container">
          <UserHMSidebar
            SetDisplaySetting={SetDisplaySetting}
            SetUseDefaultAvatar={SetUseDefaultAvatar}
            SetAvatarURL={SetAvatarURL}
            useDefaultAvatar={useDefaultAvatar}
            avatarURL={avatarURL}
            userProfile={userProfile}
            SetShowFriendPage={SetShowFriendPage}
          />
          {showFriendPage && <UserHMContact userProfile={userProfile} />}
          {!showFriendPage && (
            <FriendPage incomingFriendRequest={incomingFriendRequest} />
          )}
          <UserHMChatContent />
        </div>
      </div>
    </>
  );
}
export default UserHomePage;
