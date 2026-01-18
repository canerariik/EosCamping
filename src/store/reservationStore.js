// src/store/reservationStore.js
import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useReservationStore = create((set, get) => ({
    reservations: [],
    loading: true,
    currentUserId: null,

    init: async () => {
        set({ loading: true });
        const data = await window.electronAPI.reservationsGet();
        set({ reservations: data, loading: false });

        const user = useAuthStore.getState().user;
        if (user) set({ currentUserId: user.id });
    },

    setCurrentUser: (id) => set({ currentUserId: id }),

    add: async (res) => {
        const userId = get().currentUserId;
        if (!userId) throw new Error("User not logged in");
        res.userId = userId;

        const newRes = await window.electronAPI.reservationsAdd(res);
        set({ reservations: [...get().reservations, newRes] });
    },

    update: async (res) => {
        const userId = get().currentUserId;
        if (!userId) throw new Error("User not logged in");

        await window.electronAPI.reservationsUpdate(res.id, res, userId);
        set({
            reservations: get().reservations.map(r => (r.id === res.id ? res : r))
        });
    },

    remove: async (id) => {
        const userId = get().currentUserId;
        if (!userId) throw new Error("User not logged in");

        await window.electronAPI.reservationsDelete(id, userId);
        set({ reservations: get().reservations.filter(r => r.id !== id) });
    }
}));
