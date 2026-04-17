import { useEffect } from "react";
import "./UserHMSidebar.css";
import { useState } from "react";
function UserHMSidebar({
  SetDisplaySetting,
  useDefaultAvatar,
  SetUseDefaultAvatar,
  avatarURL,
  SetAvatarURL,
  userProfile,
  SetShowFriendPage,
}) {
  const [newMessageCircle, SetNewMessageCircle] = useState(false);

  return (
    <>
      <div className="sidebar">
        <div
          className="user-avatar"
          style={{
            backgroundImage: useDefaultAvatar
              ? 'url("src/assets/userpage/profile-default-avatar.png")'
              : `url(${avatarURL})`,
          }}
        ></div>
        <div className="chat-icon" onClick={() => SetShowFriendPage(false)}>
          {newMessageCircle && <div className="chat-icon-circle"></div>}
        </div>
        <div
          className="contact-icon"
          onClick={() => SetShowFriendPage(true)}
        ></div>
        <div
          className="setting-icon"
          onClick={() => SetDisplaySetting(true)}
        ></div>
      </div>
    </>
  );
}
export default UserHMSidebar;
