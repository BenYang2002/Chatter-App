import "./UserProfile.css";
import { useState } from "react";
import UserSettingInput from "./UserSettingInput.jsx";
function UserProfile({
  useDefaultAvatar,
  avatarURL,
  SetUseDefaultAvatar,
  SetAvatarURL,
  userProfile,
  SetUserProfile,
}) {
  const [userIdCreated, setUserIdCreated] = useState(false);
  const [showUserInput, SetShowUserInput] = useState(false);
  const [placeholderMSG, SetPlaceHolderMSG] = useState("");
  const [inputType, SetInputType] = useState("");
  return (
    <>
      {showUserInput && (
        <UserSettingInput
          showUserInput={showUserInput}
          SetShowUserInput={SetShowUserInput}
          placeholderMSG={placeholderMSG}
          inputType={inputType}
          SetUseDefaultAvatar={SetUseDefaultAvatar}
          SetAvatarURL={SetAvatarURL}
          userProfile={userProfile}
          SetUserProfile={SetUserProfile}
        />
      )}
      <div className="user-profile">
        <div className="user-profile-info">
          <div className="profile-avatar-container">
            <div
              className="profile-avatar"
              style={{
                backgroundImage: useDefaultAvatar
                  ? 'url("src/assets/userpage/profile-default-avatar.png")'
                  : `url(${avatarURL})`,
              }}
            ></div>
          </div>
          <div className="profile-name-container">
            <div className="profile-name">
              <span>name: {userProfile.name ? userProfile.name : ""} </span>
            </div>
            <div className="profile-email">
              <span>email: {userProfile.email ? userProfile.email : ""} </span>
            </div>
            <div className="profile-userid">
              <span>
                user ID: {userProfile.userId ? userProfile.userId : ""}
              </span>
            </div>
          </div>
        </div>
        <div className="modification-options">
          <div className="create-userid">
            <p
              onClick={() => {
                SetPlaceHolderMSG("create userId");
                SetInputType("UserId");
                SetShowUserInput(true);
              }}
            >
              Create User ID
            </p>
          </div>
          <div className="change-name">
            <p
              onClick={() => {
                SetPlaceHolderMSG("new username");
                SetInputType("Name");
                SetShowUserInput(true);
              }}
            >
              Change Name
            </p>
          </div>
          <div className="change-avatar">
            <p
              onClick={() => {
                SetPlaceHolderMSG("new avatar");
                SetInputType("Avatar");
                SetShowUserInput(true);
              }}
            >
              Change Avatar
            </p>
          </div>
          <div className="change-password">
            <p
              onClick={() => {
                SetPlaceHolderMSG("input previous password");
                SetInputType("Password");
                SetShowUserInput(true);
              }}
            >
              Change Password
            </p>
          </div>
          <div className="change-email">
            <p
              onClick={() => {
                SetPlaceHolderMSG("new email");
                SetInputType("Email");
                SetShowUserInput(true);
              }}
            >
              Change Email
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
