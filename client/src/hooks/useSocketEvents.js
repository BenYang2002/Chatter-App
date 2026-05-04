import { useEffect, useRef } from "react";
import socket from "../socket.js";
import { avatarHelper } from "../Service/conversation.service.js";
import { getProfilePicUrlById } from "../Service/avatar.service.js";
import { getUserNameById } from "../Service/user.service.js";
import { formatMessageTime } from "../utils/format.js";
import useChatStore from "../store/useChatStore.js";
import useFriendStore from "../store/useFriendStore.js";
import useUserStore from "../store/useUserStore.js";

const DEFAULT_AVATAR = "src/assets/userpage/profile-default-avatar.png";

export function useSocketEvents() {
  const userPK = useUserStore((s) => s.userProfile.userPK);
  const addMessage = useChatStore((s) => s.addMessage);
  const addFriend = useFriendStore((s) => s.addFriend);
  const addIncomingRequest = useFriendStore((s) => s.addIncomingRequest);
  const friendList = useFriendStore((s) => s.friendList);

  // Refs so socket handlers always see latest values without re-registering
  const friendListRef = useRef(friendList);
  useEffect(() => {
    friendListRef.current = friendList;
  }, [friendList]);

  useEffect(() => {
    if (!userPK) return;

    socket.emit("register", { userPK });

    async function handleReceiveMessage({ message }) {
      const { senderId, content, type, createAt } = message;
      const friend = friendListRef.current.find((f) => f.friendId === senderId);
      addMessage(senderId, {
        content,
        senderId,
        createAt,
        avatarURL: friend?.url ?? DEFAULT_AVATAR,
        type,
      });
    }

    async function handleAcceptFriend({ friendName, lastMessage, lastMessageDate, friendId }) {
      try {
        const { url: signedUrl } = await avatarHelper(userPK, friendId);
        const res = await fetch(signedUrl);
        const url = res.ok
          ? URL.createObjectURL(await res.blob())
          : DEFAULT_AVATAR;
        addFriend({
          url,
          name: friendName,
          friendId,
          lastMessage,
          lastMessageDate: formatMessageTime(lastMessageDate),
        });
      } catch {
        // avatar fetch failed — friend not added
      }
    }

    async function handleFriendRequest({ userId }) {
      try {
        const [{ url: avatarUrl }, { name }] = await Promise.all([
          getProfilePicUrlById(userId),
          getUserNameById(userId),
        ]);
        const res = await fetch(avatarUrl);
        const url = res.ok
          ? URL.createObjectURL(await res.blob())
          : DEFAULT_AVATAR;
        addIncomingRequest({ url, name, id: userId });
      } catch {
        // profile fetch failed
      }
    }

    socket.on("friendRequest", handleFriendRequest);
    socket.on("friendRequestAccepted", handleAcceptFriend);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("friendRequest", handleFriendRequest);
      socket.off("friendRequestAccepted", handleAcceptFriend);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [userPK]);
}