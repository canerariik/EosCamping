import { create } from "zustand";

export const useSettingStore = create((set, get) => ({
  settings: [],
  loading: false,

  // LISTELE
  load: async () => {
    set({ loading: true });

    try {
      const list = await window.electronAPI.settingsGet();
      set({ settings: list });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  // EKLE
  add: async (data) => {
    try {
      const created = await window.electronAPI.settingsAdd(data);
      set({
        settings: [...get().settings, created],
      });
    } catch (err) {
      alert(err.message || "Ekleme hatası");
    }
  },

  // GÜNCELLE
  update: async (data) => {
    try {
      const result = await window.electronAPI.settingsUpdate(data.id, data);

      if (result?.error) {
        alert(result.error);
        return;
      }

      set({
        settings: get().settings.map((s) =>
          s.id === data.id ? { ...s, ...data } : s
        ),
      });
    } catch (err) {
      console.error(err);
      alert("Güncelleme hatası");
    }
  },

  // SİL (soft delete backend zaten yapıyor)
  remove: async (id) => {
    try {
      await window.electronAPI.settingsDelete(id);

      set({
        settings: get().settings.filter((s) => s.id !== id),
      });
    } catch (err) {
      console.error(err);
      alert("Silme hatası");
    }
  },
}));