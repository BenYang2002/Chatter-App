import { useEffect, useRef } from "react";
import { getChatHistory } from "../Service/chat.service.js";
import useChatStore from "../store/useChatStore.js";
import useFriendStore from "../store/useFriendStore.js";
import useUserStore from "../store/useUserStore.js";

const DEFAULT_AVATAR = "src/assets/userpage/profile-default-avatar.png";

export function useChatHistory() {
  const addMessage = useChatStore((s) => s.addMessage);
  const friendsLoaded = useFriendStore((s) => s.friendsLoaded);
  const friendUrl = useFriendStore((s) => s.friendUrl);
  const userPK = useUserStore((s) => s.userProfile.userPK);
  const avatarURL = useUserStore((s) => s.avatarURL);
  const didInit = useRef(false);

  // avatarURL may not be set when friendsLoaded first becomes true,
  // so we capture it via ref to avoid re-running the effect
  const avatarURLRef = useRef(avatarURL);
  useEffect(() => {
    avatarURLRef.current = avatarURL;
  }, [avatarURL]);

  useEffect(() => {
    if (!friendsLoaded || didInit.current) return;
    didInit.current = true;

    (async () => {
      try {
        const data = await getChatHistory();
        for (const chatHistory of data.messages) {
          const { friendId, messages } = chatHistory;
          for (const msg of messages) {
            const isMine = msg.msgMeta.senderId === userPK;
            addMessage(friendId, {
              content: msg.content,
              senderId: msg.msgMeta.senderId,
              createAt: msg.msgMeta.createAt,
              avatarURL: isMine
                ? avatarURLRef.current ?? DEFAULT_AVATAR
                : friendUrl[friendId] ?? DEFAULT_AVATAR,
              type: msg.msgMeta.type,
            });
          }
        }
      } catch {
        // no chat history available
      }
    })();
  }, [friendsLoaded]);
}