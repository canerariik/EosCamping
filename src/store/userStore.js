// src/store/userStore.js
import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useUserStore = create((set, get) => ({
    users: [],
    currentUserId: null,

    load: async () => {
        const list = await window.electronAPI.usersList();
        set({ users: list });

        const user = useAuthStore.getState().user;
        if (user) set({ currentUserId: user.id });
    },

    setCurrentUser: (id) => set({ currentUserId: id }),

    add: async (data) => {
        const created = await window.electronAPI.usersCreate(data);
        set({ users: [...get().users, created] });
    },

    update: async (data) => {
        try {
            const result = await window.electronAPI.usersUpdate(data.id, data);

            if (result.error) {
                setTimeout(() => alert(result.error), 100);
                return;
            }

            set({
                users: get().users.map((u) =>
                    u.id === data.id ? { ...u, ...data } : u
                )
            });
        } catch (err) {
            console.error(err);
            setTimeout(() => alert("Güncelleme sırasında bir hata oluştu."), 100);
        }
    },

    remove: async (id) => {
        await window.electronAPI.usersDelete(id);
        set({ users: get().users.filter((u) => u.id !== id) });
    }
}));
