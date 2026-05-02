import apiClient from "./apiClient.js";

export async function searchFriend(friendId) {
  return apiClient.get(`/api/friend/search/${friendId}`);
}

export async function sendRequest(userId, friendId) {
  return apiClient.post("/api/friend/create", {
    userId,
    friendId,
    state: "pending",
  });
}

export async function acceptRequest(friendId, userId) {
  return apiClient.post(`/api/friend/accept/${friendId}`, { userId });
}

export async function declineRequest(friendId, userId) {
  return apiClient.post(`/api/friend/decline/${friendId}`, { userId });
}
