import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => ({
      // ─── state ───────────────────────────────────────────────────────────────────────
      user: null,
      accessToken: null,

      // ─── actions ─────────────────────────────────────────────────────────────────────
      setUser: (userObj) => set({ user: userObj }),
      setAccessToken: (token) => set({ accessToken: token }),
      clearUser: () => set({ user: null }),

      // ─── selectors / helpers ───────────────────────────────────────────────────────────
      isAuthenticated: () => !!get().user,
      getUser: () => get().user,
      getAccessToken: () => get().accessToken,
    }),
    {
      name: "user-storage", // key in localStorage
      getStorage: () => localStorage, // explicitly use localStorage
      // You could also add a `migrate` function here if you ever change your schema:
      // migrate: (persistedState) => { /*…*/ }
    }
  )
);

export default useUserStore;

// A small convenience wrapper so that components can write `useUser()` instead of `useUserStore()`.
export const useUser = () => {
  const {
    user,
    setUser,
    clearUser,
    isAuthenticated,
    getUser,
    accessToken,
    getAccessToken,
    setAccessToken,
  } = useUserStore();
  return {
    user,
    setUser,
    clearUser,
    isAuthenticated,
    getUser,
    accessToken,
    getAccessToken,
    setAccessToken,
  };
};
