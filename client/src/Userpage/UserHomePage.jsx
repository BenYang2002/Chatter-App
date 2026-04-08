import "./UserHomePage.css";
import UserHMChatContent from "./UserHMChatContent";
import UserHMContact from "./UserHMContact";
import UserHMSidebar from "./UserHMSidebar";
import UserSetting from "./Setting/UserSetting";
import FriendPage from "./UserFriend.jsx";
import { useEffect, useState } from "react";
import socket from "../socket.js";
import { connect } from "socket.io-client";
function UserHomePage({ userProfile, SetUserProfile }) {
  const [displaySetting, SetDisplaySetting] = useState(false);
  const [avatarURL, SetAvatarURL] = useState("");
  const [useDefaultAvatar, SetUseDefaultAvatar] = useState(true);
  const [showFriendPage, SetShowFriendPage] = useState(true);
  const [incomingFriendRequest, SetIncomingFriendRequest] = useState([]);
  const [chatContactInitial, SetChatContactInitial] = useState(true);
  const [chatContentName, SetChatContentName] = useState("");
  const [inputMessage, SetInputMessage] = useState("");
  // a friend list consists of:
  // avatarUrl, friendName, last message, last message date, friendId
  const [friendList, SetFriendList] = useState([]);
  // senderPK, message, date, avatarUrl
  // for chat message:
  // {
  //  "friendA": [msg1, msg2, msg3],
  //  "friendB": [msg4, msg5]
  // }
  // where msg is {senderId, content, time, avatarUrl}
  const [chatMessages, SetChatMessages] = useState([]);
  const [currentChatFriendId, SetCurrentChatFriendId] = useState(null);
  useEffect(() => {
    socket.emit("register", { userPK: userProfile.userPK });
    const handleFriend = async ({ userId }) => {
      await getFriendProfile(userId);
    };
    socket.on("friendRequest", handleFriend);
    socket.on("friendRequestAccepted", handleAcceptFriend);
    const fetchSummary = async () => {
      await getUserSummary();
    };
    fetchSummary();
    initializeFriendList();
    return () => {
      socket.off("friendRequest", handleFriend);
      socket.off("friendRequestAccepted", handleAcceptFriend);
    };
  }, []);
  async function handleAcceptFriend({
    friendName,
    lastMessage,
    lastMessageDate,
    friendId,
  }) {
    // get the friend image url
    const res = await fetch("api/conversations/avatarHelper", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ userPK: userProfile.userPK, friendId: friendId }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 200) {
      const data = await res.json();
      const fetchUrl = data.url;
      const resBlob = await fetch(fetchUrl);
      let url = "src/assets/userpage/profile-default-avatar.png";
      if (resBlob.ok) {
        url = URL.createObjectURL(await resBlob.blob());
      }
      const date = formatMessageTime(lastMessageDate);
      const friend = {
        url: url,
        name: friendName,
        friendId: friendId,
        lastMessage: lastMessage,
        lastMessageDate: date,
      };
      SetFriendList((prev) => {
        const existed = prev.some((friend) => friend.friendId === friendId);
        if (existed) return prev;
        return [...prev, friend];
      });
    }
  }

  async function initializeFriendList() {
    // grab friendlist, where each friend consists of :
    // avatarUrl, friendName, last message, last message date, friendId
    const res = await fetch("api/conversations/initializeConversations", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ userPK: userProfile.userPK }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 200) {
      const data = await res.json();
      const friendList = data.friendList;
      for (const friend of friendList) {
        const blobRes = await fetch(friend.url);
        if (blobRes.ok) {
          const blob = await blobRes.blob();
          const url = URL.createObjectURL(blob);
          friend.url = url;
        } else {
          friend.url = "src/assets/userpage/profile-default-avatar.png";
        }
      }
      SetFriendList(friendList);
    }
  }
  function formatMessageTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isToday) {
      // show HH:mm
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else {
      // show YYYY-MM-DD
      return date.toISOString().split("T")[0];
    }
  }
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
            SetIncomingFriendRequest((prev) => {
              const existed = prev.some(
                (friend) => friend.id === friendInfo.id,
              );
              if (existed) return prev;
              return [...prev, friendInfo];
            });
          } else {
            // use default image
            const url = "src/assets/userpage/profile-default-avatar.png";
            const friendInfo = { url: url, name: data.name, id: friend };
            SetIncomingFriendRequest((prev) => {
              const existed = prev.some(
                (friend) => friend.id === friendInfo.id,
              );
              if (existed) return prev;
              return [...prev, friendInfo];
            });
          }
        }
      }
    }
  }
  // something is wrong here: we are fetching the wrong name and id
  async function getFriendProfile(userId) {
    const res = await fetch(`/api/avatar/profilePic/${userId}`, {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 200) {
      const data = await res.json();
      const url = data.url;
      const resName = await fetch(`/api/user/getUserNameById/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      const nameData = await resName.json();
      const resUrl = await fetch(url, { method: "GET" });
      if (resUrl.ok) {
        const blob = await resUrl.blob();
        const url = URL.createObjectURL(blob);
        const friend = { url: url, name: nameData.name, id: userId };
        SetIncomingFriendRequest((prev) => [...prev, friend]);
      } else {
        // use default image
        const url = "src/assets/userpage/profile-default-avatar.png";
        const friend = { url: url, name: nameData.name, id: userId };
        SetIncomingFriendRequest((prev) => [...prev, friend]);
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
          {showFriendPage && (
            <UserHMContact
              userProfile={userProfile}
              friendList={friendList}
              SetChatContactInitial={SetChatContactInitial}
              SetChatContentName={SetChatContentName}
              SetInputMessage={SetInputMessage}
              SetCurrentChatFriendId={SetCurrentChatFriendId}
            />
          )}
          {!showFriendPage && (
            <FriendPage
              incomingFriendRequest={incomingFriendRequest}
              SetIncomingFriendRequest={SetIncomingFriendRequest}
              userProfile={userProfile}
            />
          )}
          <UserHMChatContent
            chatContactInitial={chatContactInitial}
            chatContentName={chatContentName}
            inputMessage={inputMessage}
            SetInputMessage={SetInputMessage}
            chatMessages={chatMessages}
            userProfile={userProfile}
            currentChatFriendId={currentChatFriendId}
            SetChatMessages={SetChatMessages}
            avatarURL={avatarURL}
          />
        </div>
      </div>
    </>
  );
}
export default UserHomePage;
