import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    login: async (username, password) => {
        const found = await window.electronAPI.authLogin({ username, password });
        if (found) {
            set({ user: found });
            return true;
        }
        return false;
    },
    logout: () => set({ user: null })
}));

