// src/store/personalStore.js
import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const usePersonelStore = create((set, get) => ({
    personels: [],
    currentUserId: null,

    load: async () => {
        const list = await window.electronAPI.personelsList();
        set({ personels: list });

        const user = useAuthStore.getState().user;
        if (user) set({ currentUserId: user.id });
    },

    setCurrentUser: (id) => set({ currentUserId: id }),

    add: async (data) => {
        const created = await window.electronAPI.personelsCreate(data);
        set({ personels: [...get().personels, created] });
    },

    update: async (data) => {
        try {
            const result = await window.electronAPI.personelsUpdate(data.id, data);

            if (result.error) {
                setTimeout(() => alert(result.error), 100);
                return;
            }

            set({
                personels: get().personels.map((u) =>
                    u.id === data.id ? { ...u, ...data } : u
                )
            });
        } catch (err) {
            console.error(err);
            setTimeout(() => alert("Güncelleme sırasında bir hata oluştu."), 100);
        }
    },

    remove: async (id) => {
        await window.electronAPI.personelsDelete(id);
        set({ personels: get().personels.filter((u) => u.id !== id) });
    }
}));
