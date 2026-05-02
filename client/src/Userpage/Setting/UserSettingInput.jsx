import "./UserSettingInput.css";
import { useState, useRef, useEffect } from "react";
import {
  validateEmail,
  validatePassword,
} from "../../Service/format.validate.js";
import { saveProfilePic, saveProfilePicTime } from "../../Service/indexDB.js";
import { changeAvatar } from "../../Service/avatar.service.js";
import {
  changeName,
  changeEmail,
  changePassword,
  confirmPassword as confirmPasswordService,
  createUserId,
} from "../../Service/user.service.js";
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
  async function handleChangeName() {
    if (!confirmInput()) return;
    try {
      const data = await changeName(inputValue);
      SetMessage(data.message);
      showMessageUIHelper();
      SetUserProfile((prev) => ({ ...prev, name: inputValue }));
    } catch (err) {
      SetMessage(err.message);
      showMessageUIHelper();
    }
  }

  async function handleChangeEmail() {
    if (!confirmInput()) return;
    if (!validateEmail(inputValue)) {
      SetMessage("Invalid email address");
      showMessageUIHelper();
      return;
    }
    try {
      const data = await changeEmail(inputValue);
      SetMessage(data.message);
      showMessageUIHelper();
      SetUserProfile((prev) => ({ ...prev, email: inputValue }));
    } catch (err) {
      SetMessage(err.message);
      showMessageUIHelper();
    }
  }

  async function handleChangePassword() {
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
      const data = await changePassword(inputValue);
      SetMessage(data.message);
      showMessageUIHelper();
    } catch (err) {
      SetMessage(err.message);
      showMessageUIHelper();
    }
  }

  async function handleChangeAvatar() {
    if (avatarPic === null) {
      SetMessage("please choose avatar");
      showMessageUIHelper();
      return;
    }
    if (url !== null) {
      URL.revokeObjectURL(url);
    }
    try {
      await changeAvatar(avatarPic);
      const newURL = URL.createObjectURL(avatarPic);
      SetUrl(newURL);
      SetAvatarURL(newURL);
      SetUseDefaultAvatar(false);
      const time = new Date().getTime();
      await saveProfilePicTime(userProfile.userPK, time);
      await saveProfilePic(userProfile.userPK, inputFile.current.files[0]);
      SetMessage("Avatar changed successfully");
      showMessageUIHelper();
    } catch (err) {
      SetMessage(err.message);
      showMessageUIHelper();
    }
  }

  async function handleConfirmPassword() {
    if (!confirmInput()) return;
    try {
      await confirmPasswordService(inputValue);
      SetInputValue("");
      SetResetPassword(true);
    } catch (err) {
      SetShowInputUI(false);
      SetMessage(err.message);
      showMessageUIHelper();
    }
  }

  async function handleCreateUserId() {
    if (!confirmInput()) return;
    try {
      const data = await createUserId(inputValue);
      SetMessage(data.message);
      showMessageUIHelper();
      SetUserProfile((prev) => ({ ...prev, userId: inputValue }));
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

  async function handleSubmit() {
    if (inputType === "UserId") handleCreateUserId();
    else if (inputType === "Email") handleChangeEmail();
    else if (inputType === "Password" && resetPassword) handleChangePassword();
    else if (inputType === "Password") handleConfirmPassword();
    else if (inputType === "Name") handleChangeName();
    else if (inputType === "Avatar") handleChangeAvatar();
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
