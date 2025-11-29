import { create } from 'zustand';

export const useReservationStore = create((set, get) => ({
    reservations: [],
    loading: true,

    // Sayısal alanları normalize et
    normalizeNumbers: (res) => ({
        ...res,
        gun: Number(res.gun) || 0,
        yetiskin: Number(res.yetiskin) || 0,
        cocuk: Number(res.cocuk) || 0,
        cadir: Number(res.cadir) || 0,
        kapora: Number(res.kapora) || 0,
        nToplam: Number(res.nToplam) || 0,
        kToplam: Number(res.kToplam) || 0,
        öNakit: Number(res.öNakit) || 0,
        öKart: Number(res.öKart) || 0,
        öHavale: Number(res.öHavale) || 0,
        kalanOdeme: Number(res.kalanOdeme) || 0
    }),

    init: async () => {
        set({ loading: true });
        try {
            const reservations = window.electronAPI
                ? await window.electronAPI.readExcel()
                : [];
            set({ reservations, loading: false });
        } catch (err) {
            console.error('Excel okuma hatası:', err);
            set({ loading: false });
        }
    },

    add: async (res) => {
        try {
            const reservations = window.electronAPI
                ? await window.electronAPI.readExcel()
                : [];

            const generateUT = () => {
                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                let code;
                do {
                    code = '';
                    for (let i = 0; i < 3; i++) {
                        code += letters[Math.floor(Math.random() * letters.length)];
                    }
                } while (reservations.some(r => r.ut === code));
                return code;
            };

            const newRes = get().normalizeNumbers({
                ...res,
                id: reservations.length,
                ut: generateUT()
            });

            const updatedReservations = [...reservations, newRes];

            if (window.electronAPI) {
                await window.electronAPI.writeExcel({ reservations: updatedReservations });
            }

            set({ reservations: updatedReservations });
        } catch (err) {
            console.error('Excel yazma hatası:', err);
        }
    },

    update: async (res) => {
        try {
            const reservations = window.electronAPI
                ? await window.electronAPI.readExcel()
                : [];

            const updatedReservations = reservations.map(r =>
                r.id === res.id ? get().normalizeNumbers(res) : r
            );

            if (window.electronAPI) {
                await window.electronAPI.writeExcel({ reservations: updatedReservations });
            }

            set({ reservations: updatedReservations });
        } catch (err) {
            console.error('Excel güncelleme hatası:', err);
        }
    },

    remove: async (id) => {
        try {
            const reservations = window.electronAPI
                ? await window.electronAPI.readExcel()
                : [];

            const updatedReservations = reservations.filter(r => r.id !== id);

            if (window.electronAPI) {
                await window.electronAPI.writeExcel({ reservations: updatedReservations });
            }

            set({ reservations: updatedReservations });
        } catch (err) {
            console.error('Excel silme hatası:', err);
        }
    }
}));
