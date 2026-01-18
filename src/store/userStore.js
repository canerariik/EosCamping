// src/store/userStore.js
import { create } from "zustand";

export const useUserStore = create((set, get) => ({
    users: [],

    load: async () => {
        const list = await window.electronAPI.usersList();
        set({ users: list });
    },

    add: async (data) => {
        const created = await window.electronAPI.userCreate(data);
        set({ users: [...get().users, created] });
    },

    update: async (data) => {
        const updated = await window.electronAPI.userUpdate(data);
        set({
            users: get().users.map(u => (u.id === data.id ? updated : u)),
        });
    },

    remove: async (id) => {
        await window.electronAPI.userRemove(id);
        set({
            users: get().users.filter(u => u.id !== id),
        });
    }
}));
