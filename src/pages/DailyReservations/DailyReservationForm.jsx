import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReservationStore } from '../../store/reservationStore';
import { useSettingStore } from '../../store/settingStore';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const emptyForm = today => ({
  isim: '',
  soyisim: '',
  telefon: '',
  tcNo: '',
  plaka: '',
  yetiskinSayisi: '',
  cocukSayisi: '',
  cadirSayisi: '',
  girisTarihi: today,
  cikisTarihi: today,
  aciklama: '',
});

export default function DailyReservationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { reservations, add, update } = useReservationStore();
  const { settings, load: loadSettings } = useSettingStore();

  const isEdit = !!id;
  const existing = reservations.find(r => r.id === id);
  const isAdmin = user?.role === 'admin';
  const isReception = user?.role === 'resepsiyon';
  const canEditGeneral = isAdmin || isReception;
  const canEditPrice = isAdmin;
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState(emptyForm(today));

  useEffect(() => {
    loadSettings();

    if (isEdit && existing) {
      setForm({
        isim: existing.isim ?? '',
        soyisim: existing.soyisim ?? '',
        telefon: existing.telefon ?? '',
        tcNo: existing.tcNo ?? '',
        plaka: existing.plaka ?? '',
        yetiskinSayisi: existing.yetiskinSayisi ?? '',
        cocukSayisi: existing.cocukSayisi ?? '',
        cadirSayisi: existing.cadirSayisi ?? '',
        girisTarihi: existing.girisTarihi ?? today,
        cikisTarihi: existing.cikisTarihi ?? today,
        aciklama: existing.aciklama ?? '',
      });
    } else {
      setForm(emptyForm(today));
    }
  }, [isEdit, existing?.id, id]);

  const getSetting = key =>
    Number(settings.find(s => s.ozellik === key)?.deger || 0);

  const yetiskinSayisi = Number(form.yetiskinSayisi) || 0;
  const cocukSayisi = Number(form.cocukSayisi) || 0;

  const yetiskinFiyat = getSetting('gunu_Birlik_Yetiskin');
  const cocukFiyat = getSetting('gunu_Birlik_Cocuk');

  const nakitUcret = Number(
    (yetiskinSayisi * yetiskinFiyat + cocukSayisi * cocukFiyat).toFixed(2),
  );

  const handleSubmit = async e => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const payload = {
      ...form,
      yetiskinSayisi,
      cocukSayisi,
      gunSayisi: 1,
      nakitUcret,
      kartUcret: nakitUcret,
      gunuBirlikMi: true,
      kayitTarihi: new Date(),
    };

    try {
      if (isEdit) {
        await update({ ...payload, id });
        toast.success('Günlük rezervasyon güncellendi.');
      } else {
        await add(payload);
        toast.success('Günlük rezervasyon oluşturuldu.');
      }

      requestAnimationFrame(() => {
        navigate('/dailyReservations');
      });
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
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
          {isEdit ? 'Günlük Rezervasyon Düzenle' : 'Günlük Rezervasyon'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/70 rounded-2xl border border-slate-800 p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              İSİM
            </label>
            <input
              value={form.isim}
              onChange={e => setForm({ ...form, isim: e.target.value })}
              disabled={isEdit && !canEditGeneral}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              SOYİSİM
            </label>
            <input
              value={form.soyisim}
              onChange={e => setForm({ ...form, soyisim: e.target.value })}
              disabled={isEdit && !canEditGeneral}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              TELEFON
            </label>
            <input
              value={form.telefon}
              onChange={e => setForm({ ...form, telefon: e.target.value })}
              disabled={isEdit && !canEditGeneral}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              TC KİMLİK NO
            </label>
            <input
              value={form.tcNo}
              onChange={e => setForm({ ...form, tcNo: e.target.value })}
              disabled={isEdit && !canEditGeneral}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              PLAKA
            </label>
            <input
              value={form.plaka}
              onChange={e => setForm({ ...form, plaka: e.target.value })}
              disabled={isEdit && !canEditGeneral}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              YETİŞKİN SAYISI
            </label>
            <input
              type="number"
              value={form.yetiskinSayisi}
              onChange={e =>
                setForm({ ...form, yetiskinSayisi: e.target.value })
              }
              disabled={isEdit && !canEditPrice}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              ÇOCUK SAYISI
            </label>
            <input
              type="number"
              value={form.cocukSayisi}
              onChange={e => setForm({ ...form, cocukSayisi: e.target.value })}
              disabled={isEdit && !canEditPrice}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              AÇIKLAMA
            </label>
            <textarea
              value={form.aciklama}
              onChange={e => setForm({ ...form, aciklama: e.target.value })}
              disabled={isEdit && !canEditGeneral}
              className="input"
              placeholder=""
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              TOPLAM ÜCRET
            </label>
            <input
              type="text"
              value={`${nakitUcret} ₺`}
              readOnly
              className="input"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition ${
              loading
                ? 'bg-emerald-800 opacity-70 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Kaydet'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dailyReservations')}
            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition text-white"
          >
            İptal
          </button>
        </div>
      </form>

      <style>
        {`
           input[type='date']::-webkit-calendar-picker-indicator {
             filter: invert(1) brightness(2);
           }
           input[type='number']::-webkit-inner-spin-button,
           input[type='number']::-webkit-outer-spin-button {
             -webkit-appearance: none;
             margin: 0;
           }
         `}
      </style>

      <style>{`
        .input{
          padding:14px;
          border-radius:12px;
          background:#1e293b;
          border:1px solid #334155;
          color:white;
        }
      `}</style>
    </div>
  );
}
