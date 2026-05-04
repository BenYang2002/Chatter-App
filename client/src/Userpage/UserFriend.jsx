import { useEffect } from "react";
import "./UserFriend.css";
import { useState } from "react";
import { acceptRequest, declineRequest } from "../Service/friend.service.js";
import { updateNFR } from "../Service/user.service.js";
import useFriendStore from "../store/useFriendStore.js";
import useUserStore from "../store/useUserStore.js";

function FriendPage() {
  const incomingFriendRequest = useFriendStore((s) => s.incomingFriendRequest);
  const removeIncomingRequest = useFriendStore((s) => s.removeIncomingRequest);
  const userProfile = useUserStore((s) => s.userProfile);

  const [newFriendRequest, SetNewFriendRequest] = useState(false);
  const [showNewFriendUI, SetShowNewFriendUI] = useState(false);
  const [showMessageUI, SetShowMessageUI] = useState(false);
  const [msg, SetMsg] = useState("");

  useEffect(() => {
    if ((incomingFriendRequest || []).length > 0) SetNewFriendRequest(true);
  }, [incomingFriendRequest]);

  async function handleAccept(friendId) {
    try {
      await acceptRequest(friendId, userProfile.userId);
      removeIncomingRequest(friendId);
      const remaining = incomingFriendRequest.filter((item) => item.id !== friendId);
      if (remaining.length === 0) {
        SetNewFriendRequest(false);
        try {
          await updateNFR(userProfile.userPK);
        } catch (err) {
          SetMsg("Failed to update friend request status: " + err.message);
          SetShowMessageUI(true);
        }
      }
      SetMsg("Successfully added friend: " + friendId);
      SetShowMessageUI(true);
    } catch (err) {
      SetMsg("Failed to accept friend request: " + err.message);
      SetShowMessageUI(true);
    }
  }

  async function handleDecline(friendId) {
    try {
      await declineRequest(friendId, userProfile.userId);
      removeIncomingRequest(friendId);
      const remaining = incomingFriendRequest.filter((item) => item.id !== friendId);
      if (remaining.length === 0) {
        SetNewFriendRequest(false);
        try {
          await updateNFR(userProfile.userPK);
        } catch (err) {
          SetMsg("Failed to update friend request status: " + err.message);
          SetShowMessageUI(true);
        }
      }
    } catch (err) {
      SetMsg("Failed to decline friend request: " + err.message);
      SetShowMessageUI(true);
    }
  }

  return (
    <>
      <div className="friend-page-container">
        {showMessageUI && (
          <div className="message-box">
            <button
              onClick={() => SetShowMessageUI(false)}
              className="close-message-page"
            >
              X
            </button>
            <p>{msg}</p>
          </div>
        )}
        {showNewFriendUI && (
          <div className="new-friend-page">
            <button
              onClick={() => SetShowNewFriendUI(false)}
              className="close-friend-page"
            >
              X
            </button>
            <div className="incoming-friend">
              <h2>Incoming Friend Request</h2>
            </div>
            {(incomingFriendRequest || []).map((friend) => (
              <div key={friend.id} className="new-friend-container">
                <div className="new-friend-profile">
                  <img
                    className="applicant-avatar"
                    src={friend.url}
                    alt="profile picture"
                  />
                  <p>{friend.name}</p>
                </div>
                <div className="button-wrapper">
                  <button onClick={() => handleAccept(friend.id)}>Accept</button>
                  <button onClick={() => handleDecline(friend.id)}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div
          className="new-friend-model"
          onClick={() => SetShowNewFriendUI((prev) => !prev)}
        >
          <div className="icon-wrapper">
            <img
              className="add-friend-icon"
              src="src/assets/friendpage/add-friend-icon.png"
              alt="add friend icon"
            />
            {newFriendRequest && <div className="reddot"></div>}
          </div>
          <p>incoming friend request</p>
        </div>
        <div className="friends-container"></div>
      </div>
    </>
  );
}

export default FriendPage;