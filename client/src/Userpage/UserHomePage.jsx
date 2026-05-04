import "./UserHomePage.css";
import UserHMChatContent from "./UserHMChatContent";
import UserHMContact from "./UserHMContact";
import UserHMSidebar from "./UserHMSidebar";
import UserSetting from "./Setting/UserSetting";
import FriendPage from "./UserFriend.jsx";
import { useState } from "react";
import { useAvatarLoader } from "../hooks/useAvatarLoader.js";
import { useSocketEvents } from "../hooks/useSocketEvents.js";
import { useFriendList } from "../hooks/useFriendList.js";
import { useChatHistory } from "../hooks/useChatHistory.js";
import { useFriendRequests } from "../hooks/useFriendRequests.js";
import useUserStore from "../store/useUserStore.js";

function UserHomePage() {
  const userPK = useUserStore((s) => s.userProfile.userPK);
  const [displaySetting, SetDisplaySetting] = useState(false);
  const [showFriendPage, SetShowFriendPage] = useState(true);

  useAvatarLoader(userPK);
  useSocketEvents();
  useFriendList(userPK);
  useChatHistory();
  useFriendRequests();

  return (
    <>
      <div className="userPage-container">
        {displaySetting && (
          <UserSetting SetDisplaySetting={SetDisplaySetting} />
        )}
        <div className="userPage-chat-container">
          <UserHMSidebar
            SetDisplaySetting={SetDisplaySetting}
            SetShowFriendPage={SetShowFriendPage}
          />
          {showFriendPage && <UserHMContact />}
          {!showFriendPage && <FriendPage />}
          <UserHMChatContent />
        </div>
      </div>
    </>
  );
}

export default UserHomePage;