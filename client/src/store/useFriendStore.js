import { create } from "zustand";

const useFriendStore = create((set) => ({
  friendList: [],
  friendUrl: {},
  incomingFriendRequest: [],
  friendsLoaded: false,
  setFriendList: (list) => set({ friendList: list }),
  setFriendUrl: (friendId, url) =>
    set((state) => ({ friendUrl: { ...state.friendUrl, [friendId]: url } })),
  setFriendUrlMap: (map) =>
    set((state) => ({ friendUrl: { ...state.friendUrl, ...map } })),
  addFriend: (friend) =>
    set((state) => {
      if (state.friendList.some((f) => f.friendId === friend.friendId))
        return state;
      return { friendList: [...state.friendList, friend] };
    }),
  addIncomingRequest: (request) =>
    set((state) => {
      if (state.incomingFriendRequest.some((f) => f.id === request.id))
        return state;
      return {
        incomingFriendRequest: [...state.incomingFriendRequest, request],
      };
    }),
  removeIncomingRequest: (id) =>
    set((state) => ({
      incomingFriendRequest: state.incomingFriendRequest.filter(
        (f) => f.id !== id
      ),
    })),
  setFriendsLoaded: (val) => set({ friendsLoaded: val }),
}));

export default useFriendStore;