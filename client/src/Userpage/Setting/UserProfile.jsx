import "./UserProfile.css";
import { useState } from "react";
import UserSettingInput from "./UserSettingInput";
import userInfo from "../../UserInfo.jsx";
function UserProfile() {
  const [userIdCreated, setUserIdCreated] = useState(false);
  const [showUserInput, setShowUserInput] = useState(false);
  return (
    <>
      {showUserInput && (
        <UserSettingInput setShowUserInput={setShowUserInput} />
      )}
      <div className="user-profile">
        <div className="user-profile-info">
          <div className="profile-avatar-container">
            <div className="profile-avatar"></div>
          </div>
          <div className="profile-name-container">
            <div className="profile-name">
              <span>name: </span>
              <span>{userInfo.name}</span>
            </div>
            <div className="profile-email">
              <span>email: </span>
              <span>{userInfo.email}</span>
            </div>
            <div className="profile-userid">
              <span>userid: </span>
              <span>{userInfo.userid}</span>
            </div>
          </div>
        </div>
        <div className="modification-options">
          <div className="create-userid">
            <p
              onClick={() => {
                setShowUserInput(true);
              }}
            >
              Create User ID
            </p>
          </div>
          <div className="change-name">
            <p>Change Name</p>
          </div>
          <div className="change-avatar">
            <p>Change Avatar</p>
          </div>
          <div className="change-password">
            <p>Change Password</p>
          </div>
          <div className="change-email">
            <p>Change Email</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
