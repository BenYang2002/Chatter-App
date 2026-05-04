import "./UserSetting.css";
import UserProfile from "./UserProfile.jsx";

function UserSetting({ SetDisplaySetting }) {
  return (
    <>
      <div className="userSetting-container">
        <div className="setting-header">
          <p>Settings</p>
          <button onClick={() => SetDisplaySetting(false)}>X</button>
        </div>
        <div className="setting-content">
          <div className="setting-options">
            <div className="setting-profile">
              <p>Profile</p>
            </div>
            <div className="setting-files">
              <p>Files</p>
            </div>
          </div>
          <div className="setting-display">
            <UserProfile />
          </div>
        </div>
      </div>
    </>
  );
}

export default UserSetting;