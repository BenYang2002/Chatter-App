import "./UserSettingInput.css";
import { useState } from "react";
function UserSettingInput({
  showUserInput,
  SetShowUserInput,
  placeholderMSG,
  inputType,
}) {
  const [inputValue, SetUserId] = useState("");
  const [showInputUI, SetShowInputUI] = useState(true);
  const [showConfirmUI, SetShowConfirmUI] = useState(false);
  const [showMessageUI, SetShowMessageUI] = useState(false);
  const [message, SetMessage] = useState("");
  async function handleSubmit() {
    console.log(inputValue);
    if (inputValue.length === 0) {
      SetMessage(`Please input your ${inputType}`);
      SetShowMessageUI(true);
      return;
    } else {
      const res = await fetch(`/api/user/create${inputType}`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ inputValue }),
      });
      const data = await res.json();
      SetMessage(data.message);
      SetShowConfirmUI(false);
      SetShowMessageUI(true);
    }
  }
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
            <input
              type="text"
              placeholder={placeholderMSG}
              onChange={(e) => SetUserId(e.target.value)}
              value={inputValue}
              className="user-setting-input"
            />
            {inputType === "Password" && (
              <input
                type="text"
                placeholder="confirm password"
                onChange={(e) => SetUserId(e.target.value)}
                value={inputValue}
                className="user-setting-input"
              />
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
                SetUserId(e.target.value);
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
