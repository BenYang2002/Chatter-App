import "./UserHMChatContent.css";
import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../Service/chat.service.js";
function UserHMChatContent({
  chatContactInitial,
  chatContentName,
  inputMessage,
  SetInputMessage,
  chatMessages,
  userProfile,
  currentChatFriendId,
  SetChatMessages,
  avatarURL,
}) {
  const messageEndRef = useRef(null);
  function formatMessageTime(dateString) {
    const msgDate = new Date(dateString);
    const now = new Date();

    const isToday =
      msgDate.getFullYear() === now.getFullYear() &&
      msgDate.getMonth() === now.getMonth() &&
      msgDate.getDate() === now.getDate();

    if (isToday) {
      // show HH:MM
      return msgDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // show date
      return msgDate.toLocaleDateString();
    }
  }
  async function handleSendMessage() {
    if (inputMessage.trim() === "") return;
    const messageSent = inputMessage.trim();
    const creationTime = new Date().toISOString();
    SetInputMessage("");
    try {
      await sendMessage({
        content: inputMessage,
        userPK: userProfile.userPK,
        receiverId: currentChatFriendId,
        creationTime,
        type: "text",
      });
      const newMessage = {
        content: messageSent,
        senderId: userProfile.userPK,
        createAt: creationTime,
        avatarURL: avatarURL,
        type: "text",
      };
      console.log(newMessage);
      SetChatMessages((prev) => {
        const oldMessages = prev[currentChatFriendId] || [];
        const newMessages = [...oldMessages, newMessage].sort(
          (a, b) => new Date(a.createAt) - new Date(b.createAt),
        );
        return { ...prev, [currentChatFriendId]: newMessages };
      });
    } catch (err) {
      // message failed to send
      console.error(err);
    }
  }
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages, currentChatFriendId]);
  return (
    <>
      {!chatContactInitial && (
        <div className="chat-content">
          <div className="message-header">
            <h2>{chatContentName}</h2>
          </div>
          <div className="message-content">
            {chatMessages[currentChatFriendId]?.map((msg) => {
              const isMine = msg.senderId === userProfile.userPK;
              return isMine ? (
                <div
                  key={currentChatFriendId + msg.createAt}
                  className="my-message-container"
                >
                  <div className="message-time-row">
                    <div className="message-time">
                      {formatMessageTime(msg.createAt)}
                    </div>
                  </div>

                  <div className="my-message-wrapper">
                    <p className="my-message">{msg.content}</p>
                    <img className="my-message-image" src={msg.avatarURL} />
                  </div>
                </div>
              ) : (
                <div
                  key={currentChatFriendId + msg.createAt}
                  className="friend-message-container"
                >
                  <div className="message-time-row">
                    <div className="message-time">
                      {formatMessageTime(msg.createAt)}
                    </div>
                  </div>

                  <div className="friend-message-wrapper">
                    <img className="friend-message-image" src={msg.avatarURL} />
                    <p className="friend-message">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef}></div>
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
              <button onClick={() => handleSendMessage()}>Send</button>
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
