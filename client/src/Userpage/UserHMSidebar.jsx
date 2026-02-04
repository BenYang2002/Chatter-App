import "./UserHMSidebar.css";
import { useState } from "react";
function UserHMSidebar({ SetDisplaySetting }) {
  return (
    <>
      <div className="sidebar">
        <div className="user-avatar"></div>
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
