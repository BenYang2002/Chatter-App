import "./UserSettingInput.css";
import { useState, useRef, useEffect } from "react";
import {
  validateEmail,
  validatePassword,
} from "../../Service/format.validate.js";
import { saveProfilePic, saveProfilePicTime } from "../../Service/indexDB.js";
function UserSettingInput({
  showUserInput,
  SetShowUserInput,
  placeholderMSG,
  inputType,
  SetUseDefaultAvatar,
  SetAvatarURL,
  userProfile,
  SetUserProfile,
  userIdCreated,
}) {
  const [inputValue, SetInputValue] = useState("");
  const [confirmPassword, SetConfirmPassword] = useState("");
  const [showInputUI, SetShowInputUI] = useState(true);
  const [showConfirmUI, SetShowConfirmUI] = useState(false);
  const [showMessageUI, SetShowMessageUI] = useState(false);
  const [message, SetMessage] = useState("");
  const [resetPassword, SetResetPassword] = useState(false);
  const [chooseAvatar, SetChooseAvatar] = useState(false);
  const [fileName, SetFileName] = useState("avatar.png");
  const [avatarPic, SetAvatarPic] = useState(null);
  const [url, SetUrl] = useState(null);
  const inputFile = useRef(null);
  async function handleChangeAvatar() {}
  async function handleChangeName(routePath) {
    if (!confirmInput()) return;
    try {
      modifyADisplay(routePath);
      SetUserProfile((prev) => ({ ...prev, name: inputValue }));
    } catch (err) {
      SetMessage(err.message);
      showMessageUIHelper();
    }
  }
  async function handleChangeEmail(routePath) {
    if (!confirmInput()) return;
    if (!validateEmail(inputValue)) {
      SetMessage("Invalid email address");
      showMessageUIHelper();
      return;
    }
    try {
      modifyADisplay(routePath);
      SetUserProfile((prev) => ({ ...prev, email: inputValue }));
    } catch (err) {
      SetMessage(err.message);
      showMessageUIHelper();
    }
  }

  async function handleChangePassword(routePath) {
    if (!confirmInput()) return;
    if (inputValue !== confirmPassword) {
      SetMessage("Passwords do not match");
      showMessageUIHelper();
      return;
    } else if (!validatePassword(inputValue)) {
      SetMessage(
        "Password should at least contain: 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character",
      );
      showMessageUIHelper();
      return;
    }
    SetResetPassword(false);
    try {
      modifyADisplay(routePath);
    } catch (err) {
      SetMessage(err.message);
      showMessageUIHelper();
    }
  }

  async function handleChangeAvatar(routePath) {
    if (avatarPic === null) {
      SetMessage("please choose avatar");
      showMessageUIHelper();
      return;
    }
    SetUseDefaultAvatar(false);
    if (url !== null) {
      URL.revokeObjectURL(url);
    }
    try {
      const res = await fetch(routePath, {
        credentials: "include",
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          size: avatarPic.size,
          contentType: avatarPic.type,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const uploadUrl = data.signedUrl;
        const upLoadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-type": avatarPic.type },
          body: avatarPic,
        });
        if (!upLoadRes.ok) {
          SetMessage("Failed to upload avatar to cloud");
          showMessageUIHelper();
        }
        const saveRoute = "/api/avatar/saveAvatar";
        const saveKeyRes = await fetch(saveRoute, {
          credentials: "include",
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            inputValue: data.key,
          }),
        });
        const newURL = URL.createObjectURL(avatarPic);
        SetUrl(newURL);
        SetAvatarURL(newURL);
        const time = new Date().getTime();
        await saveProfilePicTime(userProfile.userPK, time);
        await saveProfilePic(userProfile.userPK, inputFile.current.files[0]);
        SetUseDefaultAvatar(false);
        SetMessage("Avatar changed successfully");
        showMessageUIHelper();
      } else {
        SetMessage(data.message);
        showMessageUIHelper();
      }
    } catch (err) {
      SetMessage(err.message);
      showMessageUIHelper();
    }
  }

  async function handleConfirmPassword(routePath) {
    if (!confirmInput()) return;
    try {
      const res = await modifyHelper(routePath);
      const data = await res.json();
      if (res.ok) {
        SetInputValue("");
        SetResetPassword(true);
      } else {
        SetShowInputUI(false);
        SetMessage(data.message);
        showMessageUIHelper();
      }
    } catch (err) {
      SetMessage(err.message);
      showMessageUIHelper();
    }
  }

  async function handleCreateUserId(routePath) {
    if (!confirmInput()) return;
    try {
      const res = await modifyADisplay(routePath);
      if (res.ok) {
        SetUserProfile((prev) => ({ ...prev, userId: inputValue }));
      }
    } catch (err) {
      SetMessage(err.message);
      showMessageUIHelper();
    }
  }
  function confirmInput() {
    if (inputValue.length === 0) {
      SetMessage(`Please input your ${inputType}`);
      SetShowInputUI(false);
      SetShowMessageUI(true);
      SetShowConfirmUI(false);
      return false;
    }
    handleSubmit;
    return true;
  }

  function showConfirmUIHelper() {
    SetShowInputUI(false);
    SetShowConfirmUI(true);
  }

  function showMessageUIHelper() {
    if (showConfirmUI) SetShowConfirmUI(false);
    if (showInputUI) SetShowInputUI(false);
    SetShowMessageUI(true);
  }

  async function modifyHelper(routePath) {
    const res = await fetch(routePath, {
      credentials: "include",
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ inputValue }),
    });
    return res;
  }
  async function modifyADisplay(routePath) {
    const res = await modifyHelper(routePath);
    const data = await res.json();
    SetMessage(data.message);
    showMessageUIHelper();
    return res;
  }

  async function handleSubmit() {
    const createUserIdPath = "/api/user/createUserId";
    const changeNamePath = "/api/user/changeName";
    const changeEmailPath = "/api/user/changeEmail";
    const changePasswordPath = "/api/user/changePassword";
    const confirmPasswordPath = "/api/user/confirmPassword";
    const changeAvatarPath = "/api/avatar/changeAvatar";
    if (inputType === "UserId") handleCreateUserId(createUserIdPath);
    else if (inputType === "Email") handleChangeEmail(changeEmailPath);
    else if (inputType === "Password" && resetPassword)
      handleChangePassword(changePasswordPath);
    else if (inputType === "Password")
      handleConfirmPassword(confirmPasswordPath);
    else if (inputType === "Name") handleChangeName(changeNamePath);
    else if (inputType === "Avatar") handleChangeAvatar(changeAvatarPath);
  }

  useEffect(() => {
    if (userIdCreated && inputType === "UserId") {
      SetShowInputUI(false);
      SetMessage("Error: Your userId has been set already");
      SetShowMessageUI(true);
    }
  }, []);

  return (
    <>
      <div className="setting-input-container">
        {showInputUI && (
          <div className="setting-input-UI">
            <button
              className="setting-input-close"
              onClick={() => {
                SetShowUserInput(false);
              }}
            >
              X
            </button>
            {!(inputType === "Avatar") && (
              <input
                type="text"
                placeholder={resetPassword ? "new password" : placeholderMSG}
                onChange={(e) => SetInputValue(e.target.value)}
                value={inputValue}
                className="user-setting-input"
              />
            )}
            {inputType === "Password" && resetPassword && (
              <input
                type="text"
                placeholder="confirm password"
                onChange={(e) => SetConfirmPassword(e.target.value)}
                value={confirmPassword}
                className="user-setting-input"
              />
            )}
            {inputType === "Avatar" && (
              <>
                <p className="avatar-text">choose an avatar</p>
                <div
                  className="upload-box"
                  onClick={() => inputFile.current.click()}
                >
                  {!chooseAvatar && <p className="before-choose">+</p>}
                  {chooseAvatar && <p className="after-choose">{fileName}</p>}
                </div>
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    SetFileName(e.target.files[0].name);
                    SetAvatarPic(e.target.files[0]);
                    SetChooseAvatar(true);
                  }}
                  className="user-setting-input"
                  ref={inputFile}
                  accept=".png,.jpg,.jpeg"
                />
              </>
            )}

            <button
              onClick={() => {
                if (inputType === "UserId") {
                  SetShowConfirmUI(true);
                  SetShowInputUI(false);
                } else handleSubmit();
              }}
            >
              Submit
            </button>
          </div>
        )}
        {showConfirmUI && (
          <div className="setting-confirm-UI">
            <button
              className="setting-input-close"
              onClick={() => {
                SetShowUserInput(false);
              }}
            >
              X
            </button>
            <p>UserId will be set to:</p>
            <input
              type="text"
              className="display-userId"
              onChange={(e) => {
                SetInputValue(e.target.value);
              }}
              value={inputValue}
            />
            <b>Once being set, userId cannot be changed</b>
            <button
              onClick={() => {
                handleSubmit();
              }}
            >
              Confirm
            </button>
          </div>
        )}
        {showMessageUI && (
          <div className="setting-message-UI">
            <p>{message}</p>
            <button
              onClick={() => {
                SetShowMessageUI(false);
                SetShowUserInput(false);
              }}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </>
  );
}
export default UserSettingInput;
