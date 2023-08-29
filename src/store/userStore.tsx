import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserState {
  user: User | null;
  setUser: (user: User, token: string) => void;
}

const useStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,

      setUser: (user: User) => set(() => ({ user: user })),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useStore;
