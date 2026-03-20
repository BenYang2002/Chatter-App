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
    socket.emit("register", { userPK: userProfile.userPK });
    const handleFriend = async ({ userId, userPK }) => {
      console.log("friend request");
      console.log(userId, userPK);
      await getFriendProfile(userPK);
    };
    socket.on("friendRequest", handleFriend);
    const fetchSummary = async () => {
      await getUserSummary();
    };
    fetchSummary();
    return () => {
      socket.off("friendRequest", handleFriend);
    };
  }, []);
  async function getUserSummary() {
    const res = await fetch("/api/user/getUserSummary", {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 200) {
      const data = await res.json();
      const friendList = data.userSummary.friendId;
      for (const friend of friendList) {
        // get the friend profile for each
        console.log(`api/user/getUserNameById/${friend}`);
        const res = await fetch(`api/user/getUserNameById/${friend}`, {
          method: "GET",
          credentials: "include",
        });
        if (res.status === 200) {
          const data = await res.json();
          const name = data.name;
          const resUrl = await fetch(`api/avatar/profilePic/${friend}`, {
            method: "GET",
            credentials: "include",
          });
          if (resUrl.status === 200) {
            const dataUrl = await resUrl.json();
            const resBlob = await fetch(dataUrl.url);
            let url = "src/assets/userpage/profile-default-avatar.png";
            if (resBlob.ok) {
              const blob = await resBlob.blob();
              url = URL.createObjectURL(blob);
            }
            const friendInfo = { url: url, name: name, id: friend };
            console.log(friendInfo);
            SetIncomingFriendRequest((prev) => [...prev, friendInfo]);
          } else {
            // use default image
            const url = "src/assets/userpage/profile-default-avatar.png";
            const friendInfo = { url: url, name: data.name, id: friend };
            console.log("friend", friendInfo);
            SetIncomingFriendRequest((prev) => [...prev, friendInfo]);
          }
        }
      }
    }
  }
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
          console.log("res", res);
          if (res.ok) {
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const friend = { url: url, name: nameData.name, id: id };
            SetIncomingFriendRequest((prev) => [...prev, friend]);
          } else {
            // use default image
            const url = "src/assets/userpage/profile-default-avatar.png";
            const friend = { url: url, name: nameData.name, id: id };
            console.log("friend", friend);
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
