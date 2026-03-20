import { useEffect } from "react";
import "./UserFriend.css";
import { useState } from "react";
function FriendPage({ incomingFriendRequest }) {
  const [newFriendRequest, SetNewFriendRequest] = useState(false);
  const [showNewFriendUI, SetShowNewFriendUI] = useState(false);
  useEffect(() => {
    if ((incomingFriendRequest || []).length > 0) SetNewFriendRequest(true);
  }, [incomingFriendRequest]);
  return (
    <>
      <div className="friend-page-container">
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
                  <button>Accept</button>
                  <button>Decline</button>
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
