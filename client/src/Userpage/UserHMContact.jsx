import UserProfile from "./Setting/UserProfile";
import "./UserHMContact.css";
import { useState } from "react";
import { searchFriend, sendRequest } from "../Service/friend.service.js";
function Contact({
  userProfile,
  friendList,
  SetChatContactInitial,
  SetChatContentName,
  SetInputMessage,
  SetCurrentChatFriendId,
}) {
  const [displayClose, SetDisplayClose] = useState(false);
  const [searchText, SetSearchText] = useState("");
  const [searchedContact, SetSearchedContact] = useState(false);
  const [avatarUrl, SetAvatarUrl] = useState("");
  const [friendName, SetFriendName] = useState("");
  const [showMsg, SetShowMsg] = useState(false);
  const [message, SetMessage] = useState("");
  const [friendId, SetFriendId] = useState("");
  const [friendResButton, SetFriendResButton] = useState("Send Friend Request");
  async function handleSearch() {
    if (
      userProfile.userId === null ||
      userProfile.userId === "" ||
      userProfile.userId === "null" ||
      userProfile.userId === undefined
    ) {
      SetSearchedContact(false);
      SetMessage("Please set your own ID before adding friends");
      SetShowMsg(true);
      return;
    }
    if (userProfile.userId === friendId) {
      SetSearchedContact(false);
      SetMessage("You cannot add yourself as a friend");
      SetShowMsg(true);
      return;
    }
    SetSearchedContact(false);
    if (friendId.length === 0) {
      SetMessage("Please provide a valid ID");
      SetShowMsg(true);
      return;
    }
    SetMessage("sending friend request...");
    SetShowMsg(true);
    try {
      await sendRequest(userProfile.userId, friendId);
      SetMessage(`Successfully sent friend request to ${friendId}`);
    } catch (err) {
      SetSearchedContact(false);
      SetMessage(err.message || `failed to send friend request to ${friendId}`);
    }
    SetShowMsg(true);
  }

  async function handleSubmit(friendId) {
    if (friendId.length === 0) {
      SetSearchedContact(false);
      SetMessage("Please provide a valid ID");
      SetShowMsg(true);
      return;
    }
    SetMessage("loading...");
    SetShowMsg(true);
    try {
      const data = await searchFriend(friendId);
      SetFriendId(friendId);
      const avatar = await fetch(data.urlFriendAvatar, { method: "GET" });
      if (!avatar.ok) {
        SetAvatarUrl("src/assets/userpage/profile-default-avatar.png");
      } else {
        const blob = await avatar.blob();
        SetAvatarUrl(URL.createObjectURL(blob));
      }
      SetFriendName(data.name);
      SetShowMsg(false);
      SetSearchedContact(true);
    } catch (err) {
      SetSearchedContact(false);
      SetMessage(`User ${friendId} does not exist`);
    }
  }

  async function sendFriendRequest() {
    if (friendId.length === 0) {
      SetMessage("Please provide a valid ID");
      SetShowMsg(true);
      return;
    }
    SetFriendResButton("sending request...");
    try {
      await sendRequest(userProfile.userId, friendId);
      SetMessage("Friend request sent");
    } catch (err) {
      SetMessage(err.message || "Failed to send friend request");
    }
    SetShowMsg(true);
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
                  <button
                    className="friend-request-button"
                    onClick={() => handleSearch()}
                  >
                    {friendResButton}
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
          {(friendList || []).map((friend) => (
            <div
              key={friend.friendId}
              className="contact-container"
              onClick={() => {
                SetChatContactInitial(false);
                SetChatContentName(friend.name);
                SetInputMessage("");
                SetCurrentChatFriendId(friend.friendId);
              }}
            >
              <div className="contact-avatar-container">
                <img
                  src={friend.url}
                  alt="friend's avatar"
                  className="contact-avatar"
                />
              </div>
              <div className="message-frame">
                <div className="message-container">
                  <div className="top-message">
                    <div className="contact-name">
                      <p>{friend.name}</p>
                    </div>
                    <div className="last-message-time">
                      <p>{friend.lastMessageDate}</p>
                    </div>
                  </div>
                  <div className="bottom-message">
                    <p className="last-message">{friend.lastMessage || ""}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default Contact;
