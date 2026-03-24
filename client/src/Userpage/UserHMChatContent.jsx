import "./UserHMChatContent.css";
import { useState } from "react";
function UserHMChatContent({
  chatContactInitial,
  chatContentName,
  inputMessage,
  SetInputMessage,
}) {
  return (
    <>
      {!chatContactInitial && (
        <div className="chat-content">
          <div className="message-header">
            <h2>{chatContentName}</h2>
          </div>
          <div className="message-content">
            <div className="friend-message-container">
              <div className="message-time-row">
                <div className="message-time">2026-3-12</div>
              </div>

              <div className="friend-message-wrapper">
                <img
                  className="friend-message-image"
                  src="src/assets/userpage/profile-default-avatar.png"
                />
                <p className="friend-message">
                  hello from the friend. this is a very very long long long
                  messsssage!!!!
                </p>
              </div>
            </div>

            <div className="my-message-container">
              <div className="message-time-row">
                <div className="message-time">2026-3-12</div>
              </div>

              <div className="my-message-wrapper">
                <p className="my-message">hello from the user</p>
                <img
                  className="my-message-image"
                  src="src/assets/userpage/profile-default-avatar.png"
                />
              </div>
            </div>
          </div>
          <div className="message-input">
            <div className="message-input-tool">
              <div className="emoji"></div>
              <div className="file"></div>
              <div className="history"></div>
            </div>
            <div className="message-input-textinput">
              <textarea
                type="text"
                onChange={(e) => SetInputMessage(e.target.value)}
                value={inputMessage}
              ></textarea>
            </div>
            <div className="message-input-submit">
              <button>Send</button>
            </div>
          </div>
        </div>
      )}
      {chatContactInitial && (
        <div className="chat-initial">
          <img
            className="chat-initial-img"
            src="src/assets/userpage/chat-content-initial.png"
          />
        </div>
      )}
    </>
  );
}
export default UserHMChatContent;
