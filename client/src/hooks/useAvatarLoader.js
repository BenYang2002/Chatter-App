import { useEffect } from "react";
import {
  getProfilePic,
  getProfilePicTime,
  saveProfilePic,
  deleteProfilePicTime,
  deleteProfilePic,
} from "../Service/indexDB.js";
import {
  checkAvatar,
  getOwnProfilePicUrl,
} from "../Service/avatar.service.js";
import useUserStore from "../store/useUserStore.js";

export function useAvatarLoader(userPK) {
  const setAvatarURL = useUserStore((s) => s.setAvatarURL);
  const setUseDefaultAvatar = useUserStore((s) => s.setUseDefaultAvatar);

  useEffect(() => {
    if (!userPK) return;

    (async () => {
      const cached = await getProfilePic(userPK);
      if (cached) {
        setAvatarURL(URL.createObjectURL(cached));
        setUseDefaultAvatar(false);
      }

      const localUpdatedTime = await getProfilePicTime(userPK);
      try {
        const { updated } = await checkAvatar(userPK, localUpdatedTime);
        if (!updated) return;

        await deleteProfilePicTime(userPK);
        await deleteProfilePic(userPK);
        try {
          const { url } = await getOwnProfilePicUrl(userPK);
          const res = await fetch(url, { method: "GET" });
          if (res.ok) {
            const img = await res.blob();
            await saveProfilePic(userPK, img);
            setAvatarURL(URL.createObjectURL(img));
            setUseDefaultAvatar(false);
          } else {
            setUseDefaultAvatar(true);
            setAvatarURL("");
          }
        } catch {
          setUseDefaultAvatar(true);
          setAvatarURL("");
        }
      } catch {
        // checkAvatar failed — keep existing local state
      }
    })();
  }, [userPK]);
}