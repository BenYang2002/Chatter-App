import "./UserSettingInput.css";
import { useState } from "react";
function UserSettingInput({ setShowUserInput }) {
  const [userId, setUserId] = useState("");
  const [showInputUI, setShowInputUI] = useState(true);
  const [showConfirmUI, setShowConfirmUI] = useState(false);
  const [showMessageUI, setShowMessageUI] = useState(false);
  const [message, setMessage] = useState("");
  async function handleSubmit() {
    if (userId.length === 0) {
      setMessage("Please input your UserId");
      setShowMessageUI(true);
      return;
    } else {
      const res = await fetch("/api/user/createUserId", {
        credentials: "include",
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ userId }),
      });
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
                setShowUserInput(false);
              }}
            >
              X
            </button>
            <input
              type="text"
              placeholder="Please input your UserId"
              onChange={(e) => setUserId(e.target.value)}
              value={userId}
              className="user-setting-input"
            />
            <button
              onClick={() => {
                setShowInputUI(false);
                setShowConfirmUI(true);
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
                setShowConfirmUI(false);
                setShowInputUI(true);
              }}
            >
              X
            </button>
            <p>UserId will be set to:</p>
            <input
              type="text"
              className="display-userId"
              onChange={(e) => {
                setUserId(e.target.value);
              }}
              value={userId}
            />
            <b>Once being set, userId cannot be changed</b>
            <button
              onClick={() => {
                setShowConfirmUI(false);
                setShowMessageUI(true);
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
                setShowMessageUI(false);
                setShowUserInput(false);
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
