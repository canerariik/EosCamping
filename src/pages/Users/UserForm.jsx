// src/pages/UserForm.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { ArrowLeft } from 'lucide-react';

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, add, update } = useUserStore();

  const isEdit = !!id;
  const existing = users.find(u => u.id === id);

  const [form, setForm] = useState({
    isim: '',
    soyisim: '',
    kullaniciAdi: '',
    sifre: '',
    role: 'resepsiyon',
    kayitDurumu: true,
  });

  useEffect(() => {
    if (isEdit && existing) setForm(existing);
  }, [isEdit, existing]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (isEdit) await update({ ...form, id });
    else await add(form);

    navigate('/users');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-4xl font-bold text-white">
          {isEdit ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            placeholder="İSİM *"
            value={form.isim}
            onChange={e => setForm({ ...form, isim: e.target.value })}
            required
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />

          <input
            placeholder="SOYİSİM"
            value={form.soyisim}
            onChange={e => setForm({ ...form, soyisim: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />

          <input
            placeholder="KULLANICI ADI *"
            value={form.kullaniciAdi}
            onChange={e => setForm({ ...form, kullaniciAdi: e.target.value })}
            required
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="ŞİFRE *"
            value={form.sifre}
            onChange={e => setForm({ ...form, sifre: e.target.value })}
            required={!isEdit}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />

          {/* ROLE */}
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          >
            <option value="admin">Yönetici</option>
            <option value="resepsiyon">Resepsiyon</option>
          </select>

          {/* AKTİF / PASİF */}
          <select
            value={form.kayitDurumu ? 'aktif' : 'pasif'}
            onChange={e =>
              setForm({
                ...form,
                kayitDurumu: e.target.value === 'aktif',
              })
            }
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          >
            <option value="aktif">Aktif</option>
            <option value="pasif">Pasif</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-lg"
          >
            {isEdit ? 'Güncelle' : 'Kaydet'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/users')}
            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
