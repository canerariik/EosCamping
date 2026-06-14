// src/pages/UserForm.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, add, update } = useUserStore();
  const { user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!id;
  const existing = users.find(u => String(u.id) === String(id));

  const [form, setForm] = useState({
    isim: '',
    soyisim: '',
    kullaniciAdi: '',
    sifre: '',
    role: 'resepsiyon',
    kayitDurumu: true,
  });

  const ROLE_ORDER = ['personel', 'resepsiyon', 'admin'];

  useEffect(() => {
    if (isEdit && existing) {
      setForm({
        isim: existing.isim || '',
        soyisim: existing.soyisim || '',
        kullaniciAdi: existing.kullaniciAdi || '',
        sifre: existing.sifre || '',
        role: existing.role || 'resepsiyon',
        kayitDurumu: existing.kayitDurumu ?? true,
      });
    } else {
      setForm({
        isim: '',
        soyisim: '',
        kullaniciAdi: '',
        sifre: '',
        role: 'resepsiyon',
        kayitDurumu: true,
      });
    }
  }, [isEdit, existing]);

  const canEditRole = () => {
    if (!existing || !user) return false;

    const currentUserRole = user.role;
    const updatingUserRole = existing.role;

    if (currentUserRole === updatingUserRole) {
      return false;
    }

    return (
      ROLE_ORDER.indexOf(currentUserRole) > ROLE_ORDER.indexOf(updatingUserRole)
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      if (isEdit) {
        if (!canEditRole()) {
          toast.error('Yetkisiz düzenleme denemesi.');
          return;
        }

        await update({
          ...form,
          id,
        });

        toast.success('Kullanıcı güncellendi.');
      } else {
        await add(form);

        toast.success('Kullanıcı eklendi.');

        setForm({
          isim: '',
          soyisim: '',
          kullaniciAdi: '',
          sifre: '',
          role: 'resepsiyon',
          kayitDurumu: true,
        });
      }

      requestAnimationFrame(() => {
        navigate('/users');
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
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
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              İSİM
            </label>
            <input
              type="text"
              value={form.isim}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  isim: e.target.value,
                }))
              }
              required
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              SOYİSİM
            </label>
            <input
              type="text"
              value={form.soyisim}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  soyisim: e.target.value,
                }))
              }
              required
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              KULLANICI ADI
            </label>
            <input
              type="text"
              value={form.kullaniciAdi}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  kullaniciAdi: e.target.value,
                }))
              }
              required
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white"
            />
          </div>

          <div className="relative">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300 font-bold text-white">
                ŞİFRE
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.sifre}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    sifre: e.target.value,
                  }))
                }
                required
                className="w-full px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              YETKİ
            </label>
            <select
              value={form.role}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  role: e.target.value,
                }))
              }
              disabled={isEdit && !canEditRole()}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white"
            >
              <option value="admin">Yönetici</option>
              <option value="resepsiyon">Resepsiyon</option>
              <option value="personel">Personel</option>
            </select>
          </div>

          {isEdit && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300 font-bold text-white">
                AKTİF/PASİF
              </label>
              <select
                value={form.kayitDurumu ? 'aktif' : 'pasif'}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    kayitDurumu: e.target.value === 'aktif',
                  }))
                }
                className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white"
              >
                <option value="aktif">Aktif</option>
                <option value="pasif">Pasif</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition ${
              loading
                ? 'bg-emerald-800 cursor-not-allowed opacity-70'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Kaydet'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/users')}
            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition text-white"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
