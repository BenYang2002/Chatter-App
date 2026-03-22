import { useEffect } from "react";
import "./UserFriend.css";
import { useState } from "react";
function FriendPage({
  incomingFriendRequest,
  SetIncomingFriendRequest,
  userProfile,
}) {
  const [newFriendRequest, SetNewFriendRequest] = useState(false);
  const [showNewFriendUI, SetShowNewFriendUI] = useState(false);
  const [showMessageUI, SetShowMessageUI] = useState(false);
  const [msg, SetMsg] = useState("this is a testing msg");
  useEffect(() => {
    if ((incomingFriendRequest || []).length > 0) SetNewFriendRequest(true);
  }, [incomingFriendRequest]);
  async function handleAccept(friendId) {
    //change the state of the friend request
    const res = await fetch(`/api/friend/accept/${friendId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userProfile.userId }),
    });
    if (res.status === 200) {
      const updated = incomingFriendRequest.filter(
        (item) => item.id !== friendId,
      );
      let incomingFriend = updated.length;
      SetIncomingFriendRequest(updated);
      if (incomingFriend === 0) {
        SetNewFriendRequest(false);
        const res = await fetch("/api/userSummary/updateNFR", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ userPK: userProfile.userPK }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(res);
        if (res.status !== 200) {
          const data = await res.json();
          SetMsg(
            "Failed to update friend request status, Error message: " +
              data.message,
          );
          SetShowMessageUI(true);
        }
      }
      SetMsg("Successfully added friend: " + friendId);
      SetShowMessageUI(true);
    } else {
      const data = await res.json();
      SetMsg("Failed to accept friend request, Error message: " + data.message);
      SetShowMessageUI(true);
    }
    //change the UI for the chat page
  }
  async function handleDecline(friendId) {
    // ask server to remove that friend request
    const res = await fetch(`/api/friend/decline/${friendId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userProfile.userId }),
    });
    console.log("triggered");
    if (res.status === 200) {
      //change the UI for the chat page
      const updated = incomingFriendRequest.filter(
        (item) => item.id !== friendId,
      );
      let incomingFriend = updated.length;
      SetIncomingFriendRequest(updated);
      if (incomingFriend === 0) {
        SetNewFriendRequest(false);
        const res = await fetch("/api/userSummary/updateNFR", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ userPK: userProfile.userPK }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(res);
        if (res.status !== 200) {
          const data = await res.json();
          SetMsg(
            "Failed to update friend request status, Error message: " +
              data.message,
          );
          SetShowMessageUI(true);
        }
      }
    } else {
      const data = await res.json();
      SetMsg(
        "Failed to decline friend request, Error message: " + data.message,
      );
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
                  <button
                    onClick={() => {
                      handleAccept(friend.id);
                    }}
                  >
                    Accept
                  </button>
                  <button onClick={() => handleDecline(friend.id)}>
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div
          className="new-friend-model"
          onClick={() => {
            if (!showNewFriendUI) SetShowNewFriendUI(true);
            else SetShowNewFriendUI(false);
          }}
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
