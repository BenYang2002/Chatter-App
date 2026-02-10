import "./UserHMSidebar.css";
import { useState } from "react";
function UserHMSidebar({ SetDisplaySetting, useDefaultAvatar, avatarURL }) {
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
        <div className="chat-icon"></div>
        <div className="contact-icon"></div>
        <div
          className="setting-icon"
          onClick={() => SetDisplaySetting(true)}
        ></div>
      </div>
    </>
  );
}
export default UserHMSidebar;
