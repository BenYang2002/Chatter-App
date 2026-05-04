import { create } from "zustand";

const useChatStore = create((set) => ({
  chatMessages: {},
  currentChatFriendId: null,
  chatContactInitial: true,
  chatContentName: "",
  inputMessage: "",
  addMessage: (friendId, message) =>
    set((state) => {
      const old = state.chatMessages[friendId] || [];
      const updated = [...old, message].sort(
        (a, b) => new Date(a.createAt) - new Date(b.createAt)
      );
      return { chatMessages: { ...state.chatMessages, [friendId]: updated } };
    }),
  setChatContact: (friendId, name) =>
    set({
      currentChatFriendId: friendId,
      chatContentName: name,
      chatContactInitial: false,
    }),
  setInputMessage: (text) => set({ inputMessage: text }),
}));

export default useChatStore;