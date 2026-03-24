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
          <div className="message-content"></div>
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
