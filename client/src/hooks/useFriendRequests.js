import { useEffect } from "react";
import { getUserSummary, getUserNameById } from "../Service/user.service.js";
import { getProfilePicUrlById } from "../Service/avatar.service.js";
import useFriendStore from "../store/useFriendStore.js";

const DEFAULT_AVATAR = "src/assets/userpage/profile-default-avatar.png";

export function useFriendRequests() {
  const addIncomingRequest = useFriendStore((s) => s.addIncomingRequest);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserSummary();
        const pendingIds = data.userSummary.friendId;
        for (const id of pendingIds) {
          try {
            const { name } = await getUserNameById(id);
            try {
              const { url: avatarUrl } = await getProfilePicUrlById(id);
              const res = await fetch(avatarUrl);
              const url = res.ok
                ? URL.createObjectURL(await res.blob())
                : DEFAULT_AVATAR;
              addIncomingRequest({ url, name, id });
            } catch {
              addIncomingRequest({ url: DEFAULT_AVATAR, name, id });
            }
          } catch {
            // user not found, skip
          }
        }
      } catch {
        // getUserSummary failed
      }
    })();
  }, []);
}