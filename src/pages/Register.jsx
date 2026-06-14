import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { toast } from 'react-toastify';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { add } = useUserStore();

  const [form, setForm] = useState({
    isim: '',
    soyisim: '',
    kullaniciAdi: '',
    sifre: '',
    role: 'resepsiyon',
    kayitDurumu: true,
  });

  const handleSubmit = async e => {
    e.preventDefault();

    setLoading(true);

    try {
      await add(form);

      toast.success('Kullanıcı oluşturuldu.');

      setForm({
        isim: '',
        soyisim: '',
        kullaniciAdi: '',
        sifre: '',
        role: 'resepsiyon',
        kayitDurumu: true,
      });

      requestAnimationFrame(() => {
        navigate('/login');
      });
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl p-10 w-full max-w-md border border-slate-700">
        <h1 className="text-5xl font-bold text-white mb-6 text-center">
          Yeni Kullanıcı
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-6 py-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none"
              required
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
              className="w-full px-6 py-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none"
              required
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
              className="w-full px-6 py-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              KULLANICI ŞİFRE
            </label>
            <input
              type="password"
              value={form.sifre}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  sifre: e.target.value,
                }))
              }
              className="w-full px-6 py-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none"
              required
            />
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
              className="w-full px-6 py-4 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-4 focus:ring-white/50"
            >
              <option value="" disabled hidden>
                Lütfen seçiniz
              </option>
              <option value="admin">Admin</option>
              <option value="resepsiyon">Resepsiyon</option>
              <option value="personel">Personel</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 bg-emerald-600 text-white font-bold text-lg rounded-xl ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Oluşturuluyor...' : 'Kullanıcı Oluştur'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition text-white"
            >
              Geri Dön
            </button>
          </div>
        </form>
        <style>
          {`
            select option {
                background-color: rgba(255,255,255);
                color: black;
            }
          `}
        </style>
      </div>
    </div>
  );
}
