import "./UserHomePage.css";
import UserHMChatContent from "./UserHMChatContent";
import UserHMContact from "./UserHMContact";
import UserHMSidebar from "./UserHMSidebar";
import UserSetting from "./Setting/UserSetting";
import { useState } from "react";
function UserHomePage() {
  const [displaySetting, SetDisplaySetting] = useState(false);
  return (
    <>
      <div className="userPage-container">
        {displaySetting && (
          <UserSetting SetDisplaySetting={SetDisplaySetting} />
        )}
        <div className="userPage-chat-container">
          <UserHMSidebar SetDisplaySetting={SetDisplaySetting} />
          <UserHMContact />
          <UserHMChatContent />
        </div>
      </div>
    </>
  );
}
export default UserHomePage;
