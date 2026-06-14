import { useEffect, useState } from 'react';
import { useSettingStore } from '../../store/settingStore';
import { toast } from 'react-toastify';

export default function AccommodationList() {
  const { settings, load, add, update, remove, loading } = useSettingStore();

  const [form, setForm] = useState({
    ozellik: '',
    deger: '',
    kayitDurumu: true,
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    if (editId) {
      await update({ ...form, id: editId });
      toast.success('Özellik güncellendi.');
    } else {
      await add(form);
      toast.success('Özellik eklendi.');
    }

    setForm({
      ozellik: '',
      deger: '',
      kayitDurumu: true,
    });

    setEditId(null);
    load();
  };

  const handleEdit = item => {
    setForm({
      ozellik: item.ozellik,
      deger: item.deger,
      kayitDurumu: item.kayitDurumu,
    });
    setEditId(item.id);
  };

  if (loading) {
    return <div className="text-white text-center text-2xl">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          {editId ? 'Özellik Güncelle' : 'Yeni Özellik Ekle'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              ÖZELLİK ADI
            </label>
            <input
              value={form.ozellik}
              onChange={e => setForm({ ...form, ozellik: e.target.value })}
              className="px-4 py-3 rounded-xl bg-slate-800 text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              ÖZELLİK DEĞER
            </label>
            <input
              value={form.deger}
              onChange={e => setForm({ ...form, deger: e.target.value })}
              className="px-4 py-3 rounded-xl bg-slate-800 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold text-white"
            >
              {editId ? 'Güncelle' : 'Kaydet'}
            </button>

            <button
              type="button"
              onClick={() => {
                setForm({
                  ozellik: '',
                  deger: '',
                  kayitDurumu: true,
                });
                setEditId(null);
              }}
              className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-bold text-white"
            >
              Temizle
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settings.length === 0 ? (
          <div className="text-slate-400">Kayıt yok</div>
        ) : (
          settings.map(item => (
            <div
              key={item.id}
              className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {item.ozellik}
              </h3>

              <p className="text-slate-300 mb-2">
                Değer:{' '}
                <span className="text-white font-medium">{item.deger}</span>
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg text-blue-300"
                >
                  Düzenle
                </button>

                {!item.defaultVeriMi && (
                  <button
                    onClick={() => remove(item.id)}
                    className="px-3 py-2 bg-red-600/30 hover:bg-red-600/50 rounded-lg text-red-300"
                  >
                    Sil
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
