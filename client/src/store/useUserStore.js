import { create } from "zustand";

const useUserStore = create((set) => ({
  userProfile: {
    avatarKey: localStorage.getItem("avatarKey") ?? null,
    name: localStorage.getItem("name") ?? null,
    email: localStorage.getItem("email") ?? null,
    userId: localStorage.getItem("userId") ?? null,
    userPK: (() => {
      const v = localStorage.getItem("userPK");
      return v && v !== "null" ? v : null;
    })(),
  },
  avatarURL: "",
  useDefaultAvatar: true,
  setUserProfile: (profile) => set({ userProfile: profile }),
  updateUserProfile: (partial) =>
    set((state) => ({ userProfile: { ...state.userProfile, ...partial } })),
  setAvatarURL: (url) => set({ avatarURL: url }),
  setUseDefaultAvatar: (val) => set({ useDefaultAvatar: val }),
}));

export default useUserStore;