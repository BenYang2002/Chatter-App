import "./UserHomePage.css";
import UserHMChatContent from "./UserHMChatContent";
import UserHMContact from "./UserHMContact";
import UserHMSidebar from "./UserHMSidebar";
import UserSetting from "./Setting/UserSetting";
import FriendPage from "./UserFriend.jsx";
import { useEffect, useState, useRef, use } from "react";
import socket from "../socket.js";
import { connect } from "socket.io-client";
import {
  getProfilePic,
  getProfilePicTime,
  saveProfilePic,
  deleteProfilePicTime,
  deleteProfilePic,
} from "../Service/indexDB.js";
import {
  initializeConversations,
  avatarHelper,
} from "../Service/conversation.service.js";
import { getChatHistory } from "../Service/chat.service.js";
import {
  checkAvatar,
  getOwnProfilePicUrl,
  getProfilePicUrlById,
} from "../Service/avatar.service.js";
import { getUserSummary, getUserNameById } from "../Service/user.service.js";
function UserHomePage({ userProfile, SetUserProfile }) {
  const [displaySetting, SetDisplaySetting] = useState(false);
  const [avatarURL, SetAvatarURL] = useState("");
  const [useDefaultAvatar, SetUseDefaultAvatar] = useState(true);
  const [showFriendPage, SetShowFriendPage] = useState(true);
  const [incomingFriendRequest, SetIncomingFriendRequest] = useState([]);
  const [chatContactInitial, SetChatContactInitial] = useState(true);
  const [chatContentName, SetChatContentName] = useState("");
  const [inputMessage, SetInputMessage] = useState("");
  const [friendUrl, SetFriendUrl] = useState({});
  // a friend list consists of:
  // avatarUrl, friendName, last message, last message date, friendId
  const [friendList, SetFriendList] = useState([]);
  const friendListRef = useRef(friendList);
  const didInitRef = useRef(false);
  const avatarUrlRef = useRef(avatarURL);
  useEffect(() => {
    friendListRef.current = friendList;
  }, [friendList]);
  useEffect(() => {
    avatarUrlRef.current = avatarURL;
  }, [avatarURL]);
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
    socket.on("receiveMessage", handleReceiveMessage);
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
        try {
          const updatedData = await checkAvatar(
            userProfile.userPK,
            localUpdatedTime,
          );
          if (updatedData.updated) {
            await deleteProfilePicTime(userProfile.userPK);
            await deleteProfilePic(userProfile.userPK);
            try {
              const data = await getOwnProfilePicUrl(userProfile.userPK);
              const retrieveRes = await fetch(data.url, { method: "GET" });
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
            } catch (err) {
              SetUseDefaultAvatar(true);
              SetAvatarURL("");
            }
          }
        } catch (err) {
          // checkAvatar failed, keep existing local state
        }
      }
    })();
    const fetchSummary = async () => {
      await loadFriendRequests();
    };
    fetchSummary();
    const init = async () => {
      const mp = await initializeFriendList();
      await intializeChatHistory(mp);
    };
    init();
    return () => {
      socket.off("friendRequest", handleFriend);
      socket.off("friendRequestAccepted", handleAcceptFriend);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);
  async function handleReceiveMessage({ message }) {
    const { senderId, content, type, createAt } = message;
    const friend = friendListRef.current.find(
      (friend) => friend.friendId === senderId,
    );
    const url = friend
      ? friend.url
      : "src/assets/userpage/profile-default-avatar.png";
    const newMessage = {
      content: content,
      senderId: senderId,
      createAt: createAt,
      avatarURL: url,
      type: type,
    };
    SetChatMessages((prev) => {
      const oldMessages = prev[senderId] || [];
      const newMessages = [...oldMessages, newMessage].sort(
        (a, b) => new Date(a.createAt) - new Date(b.createAt),
      );
      return {
        ...prev,
        [senderId]: newMessages,
      };
    });
  }
  async function handleAcceptFriend({
    friendName,
    lastMessage,
    lastMessageDate,
    friendId,
  }) {
    try {
      const data = await avatarHelper(userProfile.userPK, friendId);
      const resBlob = await fetch(data.url);
      let url = "src/assets/userpage/profile-default-avatar.png";
      if (resBlob.ok) {
        url = URL.createObjectURL(await resBlob.blob());
      }
      const date = formatMessageTime(lastMessageDate);
      const friend = {
        url,
        name: friendName,
        friendId,
        lastMessage,
        lastMessageDate: date,
      };
      SetFriendList((prev) => {
        if (prev.some((f) => f.friendId === friendId)) return prev;
        return [...prev, friend];
      });
    } catch (err) {
      // avatar fetch failed — friend not added to list
    }
  }

  async function intializeChatHistory(urlMap) {
    if (didInitRef.current) return;
    didInitRef.current = true;
    try {
      const data = await getChatHistory();
      for (const chatHistory of data.messages) {
        const friendId = chatHistory.friendId;
        for (const msg of chatHistory.messages) {
          const newMessage = {
            content: msg.content,
            senderId: msg.msgMeta.senderId,
            createAt: msg.msgMeta.createAt,
            avatarURL:
              msg.msgMeta.senderId === userProfile.userPK
                ? avatarUrlRef.current
                : urlMap[friendId] ||
                  "src/assets/userpage/profile-default-avatar.png",
            type: msg.msgMeta.type,
          };
          SetChatMessages((prev) => {
            const oldMessages = prev[friendId] || [];
            const newMessages = [...oldMessages, newMessage].sort(
              (a, b) => new Date(a.createAt) - new Date(b.createAt),
            );
            return { ...prev, [friendId]: newMessages };
          });
        }
      }
    } catch (err) {
      // no chat history available
    }
  }

  async function initializeFriendList() {
    try {
      const data = await initializeConversations(userProfile.userPK);
      const urlMap = {};
      const friendList = data.friendList;
      for (const friend of friendList) {
        const blobRes = await fetch(friend.url);
        if (blobRes.ok) {
          const blob = await blobRes.blob();
          const url = URL.createObjectURL(blob);
          friend.url = url;
          urlMap[friend.friendId] = url;
          SetFriendUrl((prev) => ({ ...prev, [friend.friendId]: url }));
        } else {
          friend.url = "src/assets/userpage/profile-default-avatar.png";
          urlMap[friend.friendId] = friend.url;
          SetFriendUrl((prev) => ({ ...prev, [friend.friendId]: friend.url }));
        }
      }
      SetFriendList(friendList);
      return urlMap;
    } catch (err) {
      return {};
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
  async function loadFriendRequests() {
    try {
      const data = await getUserSummary();
      const friendList = data.userSummary.friendId;
      for (const friend of friendList) {
        try {
          const nameData = await getUserNameById(friend);
          const name = nameData.name;
          try {
            const urlData = await getProfilePicUrlById(friend);
            const resBlob = await fetch(urlData.url);
            let url = "src/assets/userpage/profile-default-avatar.png";
            if (resBlob.ok) {
              url = URL.createObjectURL(await resBlob.blob());
            }
            const friendInfo = { url, name, id: friend };
            SetIncomingFriendRequest((prev) => {
              if (prev.some((f) => f.id === friendInfo.id)) return prev;
              return [...prev, friendInfo];
            });
          } catch (err) {
            const friendInfo = {
              url: "src/assets/userpage/profile-default-avatar.png",
              name,
              id: friend,
            };
            SetIncomingFriendRequest((prev) => {
              if (prev.some((f) => f.id === friendInfo.id)) return prev;
              return [...prev, friendInfo];
            });
          }
        } catch (err) {
          // user not found, skip
        }
      }
    } catch (err) {
      // getUserSummary failed
    }
  }
  async function getFriendProfile(userId) {
    try {
      const [avatarData, nameData] = await Promise.all([
        getProfilePicUrlById(userId),
        getUserNameById(userId),
      ]);
      const resUrl = await fetch(avatarData.url, { method: "GET" });
      const url = resUrl.ok
        ? URL.createObjectURL(await resUrl.blob())
        : "src/assets/userpage/profile-default-avatar.png";
      SetIncomingFriendRequest((prev) => [
        ...prev,
        { url, name: nameData.name, id: userId },
      ]);
    } catch (err) {
      // profile fetch failed
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
