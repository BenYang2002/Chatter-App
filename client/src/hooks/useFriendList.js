import { useEffect } from "react";
import { initializeConversations } from "../Service/conversation.service.js";
import useFriendStore from "../store/useFriendStore.js";

const DEFAULT_AVATAR = "src/assets/userpage/profile-default-avatar.png";

export function useFriendList(userPK) {
  const setFriendList = useFriendStore((s) => s.setFriendList);
  const setFriendUrlMap = useFriendStore((s) => s.setFriendUrlMap);
  const setFriendsLoaded = useFriendStore((s) => s.setFriendsLoaded);

  useEffect(() => {
    if (!userPK) return;

    (async () => {
      try {
        const data = await initializeConversations(userPK);
        const urlMap = {};

        const resolved = await Promise.all(
          data.friendList.map(async (friend) => {
            try {
              const res = await fetch(friend.url);
              if (res.ok) {
                const url = URL.createObjectURL(await res.blob());
                urlMap[friend.friendId] = url;
                return { ...friend, url };
              }
            } catch {}
            urlMap[friend.friendId] = DEFAULT_AVATAR;
            return { ...friend, url: DEFAULT_AVATAR };
          })
        );

        setFriendList(resolved);
        setFriendUrlMap(urlMap);
        setFriendsLoaded(true);
      } catch {
        setFriendsLoaded(true);
      }
    })();
  }, [userPK]);
}