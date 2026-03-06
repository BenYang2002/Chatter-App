import "./UserHMContact.css";
import { useState } from "react";
function Contact() {
  const [displayClose, SetDisplayClose] = useState(false);
  const [searchText, SetSearchText] = useState("");
  const [searchedContact, SetSearchedContact] = useState(false);
  const [avatarUrl, SetAvatarUrl] = useState("");
  const [friendName, SetFriendName] = useState("");
  const [showMsg, SetShowMsg] = useState(false);
  const [message, SetMessage] = useState("");
  async function handleSubmit(friendId) {
    if (friendId.length === 0) {
      SetMessage("Please provide a valid ID");
      SetShowMsg(true);
      return;
    }
    SetMessage("loading...");
    SetShowMsg(true);
    const res = await fetch(`api/friend/search/${friendId}`, {
      method: "GET",
    });
    if (res.status === 200) {
      const data = await res.json();
      const avatarUrl = data.urlFriendAvatar;
      const name = data.name;
      const avatar = await fetch(avatarUrl, { method: "GET" });
      console.log(avatar);
      if (!avatar.ok) {
        SetAvatarUrl("src/assets/userpage/profile-default-avatar.png");
      } else {
        const blob = await avatar.blob();
        const url = URL.createObjectURL(blob);
        SetAvatarUrl(url);
      }
      SetFriendName(name);
      SetShowMsg(false);
      SetSearchedContact(true);
    } else {
      SetSearchedContact(false);
      SetMessage(`User ${friendId} does not exist`);
    }
  }
  return (
    <>
      <div className="contacts">
        <div className="top-field">
          <div className={`search-bar ${displayClose ? "active" : ""}`}>
            {searchedContact && (
              <div className="friend-search-modal">
                <button
                  className="close-friend-request"
                  onClick={(e) => {
                    SetSearchedContact(false);
                  }}
                >
                  X
                </button>
                <div className="friend-info">
                  <img
                    src={avatarUrl}
                    alt="friend's avatar"
                    className="search-friend-avatar"
                  />
                  <p className="friend-name">User name: {friendName}</p>
                </div>
                <div className="friend-request-container">
                  <button className="friend-request-button">
                    Send Friend Request
                  </button>
                </div>
              </div>
            )}
            {showMsg && (
              <div className="error-modal">
                <button
                  className="close-error-modal"
                  onClick={(e) => {
                    SetShowMsg(false);
                  }}
                >
                  X
                </button>
                <b>{message}</b>
              </div>
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSubmit(searchText);
              }}
            >
              <button className="magnify-glass" type="submit">
                🔍
              </button>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search friends by id"
                  onClick={() => SetDisplayClose(true)}
                  onBlur={() => SetDisplayClose(false)}
                  onChange={(e) => {
                    SetSearchText(e.target.value);
                  }}
                  value={searchText}
                />
              </div>
              {displayClose && (
                <div
                  onMouseDown={(e) => e.preventDefault()}
                  className="close"
                  onClick={() => {
                    SetSearchText("");
                  }}
                >
                  ❌
                </div>
              )}
            </form>
          </div>
        </div>
        <div className="contact-list">
          <div className="example-contact">
            <div className="contact-avatar-container">
              <div className="contact-avatar"></div>
            </div>
            <div className="message-frame">
              <div className="message-container">
                <div className="top-message">
                  <div className="contact-name">
                    <p>赵玹辛</p>
                  </div>
                  <div className="last-message-time">
                    <p>2026/1/29</p>
                  </div>
                </div>
                <div className="bottom-message">
                  <p className="last-message">
                    this is the last message we send
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Contact;
