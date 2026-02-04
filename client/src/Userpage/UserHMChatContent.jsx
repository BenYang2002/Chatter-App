import "./UserHMChatContent.css";
function UserHMChatContent() {
  return (
    <div className="chat-content">
      <div className="message-header"></div>
      <div className="message-content"></div>
      <div className="message-input">
        <div className="message-input-tool">
          <div className="emoji"></div>
          <div className="file"></div>
          <div className="history"></div>
        </div>
        <div className="message-input-textinput"></div>
        <div className="message-input-submit"></div>
      </div>
    </div>
  );
}
export default UserHMChatContent;
