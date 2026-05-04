import "./UserHMChatContent.css";
import { useEffect, useRef } from "react";
import { sendMessage } from "../Service/chat.service.js";
import { formatMessageTime } from "../utils/format.js";
import useChatStore from "../store/useChatStore.js";
import useUserStore from "../store/useUserStore.js";

function UserHMChatContent() {
  const chatMessages = useChatStore((s) => s.chatMessages);
  const currentChatFriendId = useChatStore((s) => s.currentChatFriendId);
  const chatContactInitial = useChatStore((s) => s.chatContactInitial);
  const chatContentName = useChatStore((s) => s.chatContentName);
  const inputMessage = useChatStore((s) => s.inputMessage);
  const setInputMessage = useChatStore((s) => s.setInputMessage);
  const addMessage = useChatStore((s) => s.addMessage);
  const userProfile = useUserStore((s) => s.userProfile);
  const avatarURL = useUserStore((s) => s.avatarURL);

  const messageEndRef = useRef(null);

  async function handleSendMessage() {
    if (inputMessage.trim() === "") return;
    const messageSent = inputMessage.trim();
    const creationTime = new Date().toISOString();
    setInputMessage("");
    try {
      await sendMessage({
        content: messageSent,
        userPK: userProfile.userPK,
        receiverId: currentChatFriendId,
        creationTime,
        type: "text",
      });
      addMessage(currentChatFriendId, {
        content: messageSent,
        senderId: userProfile.userPK,
        createAt: creationTime,
        avatarURL,
        type: "text",
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
                onChange={(e) => setInputMessage(e.target.value)}
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