// src/store/authStore.js
import { create } from 'zustand';

const mockUsers = [
    { id: 1, username: "admin", password: "123", role: "admin", name: "Ahmet Yılmaz" },
    { id: 2, username: "resepsiyon", password: "123", role: "resepsiyon", name: "Zeynep Kaya" }
];

export const useAuthStore = create((set) => ({
    user: null,

    login: (username, password) => {
        const found = mockUsers.find(
            u => u.username === username && u.password === password
        );
        if (found) {
            const { password, ...userWithoutPass } = found;
            set({ user: userWithoutPass });
            return true;
        }
        return false;
    },

    logout: () => set({ user: null })
}));