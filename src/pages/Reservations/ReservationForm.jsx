import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReservationStore } from '../../store/reservationStore';
import { useSettingStore } from '../../store/settingStore';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

export default function ReservationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { reservations, add, update } = useReservationStore();
  const { settings, load: loadSettings } = useSettingStore();
  const [loading, setLoading] = useState(false);
  const isEdit = !!id;
  const existing = reservations.find(r => r.id === id);
  const isAdmin = user?.role === 'admin';
  const isReception = user?.role === 'resepsiyon';
  const canEditGeneral = isAdmin || isReception;
  const canEditPrice = isAdmin;

  const [form, setForm] = useState({
    isim: '',
    soyisim: '',
    telefon: '',
    tcNo: '',
    plaka: '',
    yetiskinSayisi: '',
    cocukSayisi: '',
    cadirSayisi: '',
    girisTarihi: '',
    cikisTarihi: '',
    kampBolge: '',
    kapora: '',
    nakitUcret: '',
    kartUcret: '',
    odenenNakit: '',
    odenenKart: '',
    odenenHavale: '',
    kalanNakitUcret: '',
    kalanKartUcret: '',
    aciklama: '',
  });

  useEffect(() => {
    loadSettings();

    if (isEdit && existing) {
      setForm({
        ...existing,
        yetiskinSayisi: String(existing.yetiskinSayisi || ''),
        cocukSayisi: String(existing.cocukSayisi || ''),
        cadirSayisi: String(existing.cadirSayisi || ''),
        kapora: String(existing.kapora || ''),
        odenenNakit: String(existing.odenenNakit || ''),
        odenenKart: String(existing.odenenKart || ''),
        odenenHavale: String(existing.odenenHavale || ''),
      });
    } else {
      setForm({
        isim: '',
        soyisim: '',
        telefon: '',
        tcNo: '',
        plaka: '',
        yetiskinSayisi: '',
        cocukSayisi: '',
        cadirSayisi: '',
        girisTarihi: '',
        cikisTarihi: '',
        kampBolge: '',
        kapora: '',
        nakitUcret: '',
        kartUcret: '',
        odenenNakit: '',
        odenenKart: '',
        odenenHavale: '',
        kalanNakitUcret: '',
        kalanKartUcret: '',
        aciklama: '',
      });
    }
  }, [isEdit, existing, id]);

  const yetiskinSayisi = Number(form.yetiskinSayisi) || 0;

  const cocukSayisi = Number(form.cocukSayisi) || 0;

  const kapora = Number(form.kapora) || 0;

  const odenenNakit = Number(form.odenenNakit) || 0;

  const odenenKart = Number(form.odenenKart) || 0;

  const odenenHavale = Number(form.odenenHavale) || 0;

  const diff =
    (new Date(form.cikisTarihi) - new Date(form.girisTarihi)) /
    (1000 * 60 * 60 * 24);

  const gunSayisi = Math.max(1, Math.ceil(diff));

  const settingsMap = useMemo(() => {
    const map = {};

    (settings || []).forEach(s => {
      map[s.ozellik] = Number(s.deger || 0);
    });

    return map;
  }, [settings]);

  const yetiskinFiyat = settingsMap['yetiskin_Ucret'];
  const cocukFiyat = settingsMap['cocuk_Ucret'];

  const nakitUcret =
    Number(
      gunSayisi * (yetiskinSayisi * yetiskinFiyat + cocukSayisi * cocukFiyat) -
        kapora,
    ) || 0;

  const kartUcret = Number((nakitUcret * 1.1).toFixed(2) || 0);

  const kalanNakitUcret = Number(
    Math.max(0, nakitUcret - (odenenNakit + odenenHavale)).toFixed(2),
  );

  const kalanKartUcret = Number(
    Math.max(0, ((nakitUcret - odenenNakit) * 1.1).toFixed(2)),
  );

  const getDateRange = (start, end) => {
    const dates = [];
    const current = new Date(start);
    const last = new Date(end);

    while (current < last) {
      dates.push(format(new Date(current), 'yyyy-MM-dd'));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const maxCadir = settingsMap['cadir_Sayisi'];

  const reservationMap = useMemo(() => {
    const map = {};

    (reservations || []).forEach(r => {
      if (isEdit && r.id === id) return;

      const dates = getDateRange(r.girisTarihi, r.cikisTarihi);

      dates.forEach(date => {
        if (!map[date]) map[date] = 0;
        map[date] += Number(r.cadirSayisi || 0);
      });
    });

    return map;
  }, [reservations, isEdit, id]);

  const today = format(new Date(), 'yyyy-MM-dd');

  const isDateFull = useCallback(
    date => {
      const currentDate = format(date, 'yyyy-MM-dd');

      const currentReservationCount = reservationMap[currentDate] || 0;

      const selectedCadir = Number(form.cadirSayisi || 0);

      return currentReservationCount + selectedCadir > maxCadir;
    },
    [reservationMap, form.cadirSayisi, maxCadir],
  );

  const handleSubmit = async e => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    if (!form.girisTarihi || !form.cikisTarihi) {
      toast.error('Giriş ve çıkış tarihi seçiniz!!');
      return;
    }

    const selectedDates = getDateRange(form.girisTarihi, form.cikisTarihi);

    const selectedCadir = Number(form.cadirSayisi || 0);

    const hasFullDate = selectedDates.some(date => {
      const currentReservationCount = reservationMap[date] || 0;
      return currentReservationCount + selectedCadir > maxCadir;
    });

    if (hasFullDate) {
      toast.error('Seçilen tarih aralığında yeterli çadır kapasitesi yok!');
      return;
    }

    const payload = {
      ...form,
      yetiskinSayisi,
      cocukSayisi,
      cadirSayisi: selectedCadir,
      gunSayisi,
      kapora,
      nakitUcret: Number(nakitUcret.toFixed(2)),
      kartUcret,
      odenenNakit,
      odenenKart,
      odenenHavale,
      kalanNakitUcret,
      kalanKartUcret,
      gunuBirlikMi: false,
      kayitTarihi: new Date(),
    };

    try {
      if (isEdit) {
        await update({ ...payload, id });
        toast.success('Kamp rezervasyonu güncellendi.');
      } else {
        await add(payload);
        toast.success('Kamp rezervasyonu oluşturuldu.');
      }

      requestAnimationFrame(() => {
        navigate('/reservations');
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
          {isEdit ? 'Rezervasyon Düzenle' : 'Yeni Rezervasyon'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 rounded-2xl border border-slate-800 p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              İSİM
            </label>
            <input
              value={form.isim}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  isim: e.target.value,
                }))
              }
              required
              disabled={isEdit && !canEditGeneral}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              SOYİSİM
            </label>
            <input
              value={form.soyisim}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  soyisim: e.target.value,
                }))
              }
              required
              disabled={isEdit && !canEditGeneral}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              TELEFON NO
            </label>
            <input
              value={form.telefon}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  telefon: e.target.value,
                }))
              }
              required
              disabled={isEdit && !canEditGeneral}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              TC KİMLİK NO
            </label>
            <input
              value={form.tcNo}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  tcNo: e.target.value,
                }))
              }
              required
              disabled={isEdit && !canEditGeneral}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              PLAKA
            </label>
            <input
              value={form.plaka}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  plaka: e.target.value,
                }))
              }
              disabled={isEdit && !canEditGeneral}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
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
                setForm(prev => ({
                  ...prev,
                  yetiskinSayisi: e.target.value,
                }))
              }
              required
              disabled={isEdit && !canEditPrice}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              ÇOCUK SAYISI
            </label>
            <input
              type="number"
              value={form.cocukSayisi}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  cocukSayisi: e.target.value,
                }))
              }
              required
              disabled={isEdit && !canEditPrice}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              ÇADIR SAYISI
            </label>
            <input
              type="number"
              value={form.cadirSayisi}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  cadirSayisi: e.target.value,
                }))
              }
              required
              disabled={isEdit && !canEditPrice}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              GİRİŞ TARİHİ
            </label>

            <input
              type="date"
              value={form.girisTarihi}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  girisTarihi: e.target.value,
                }))
              }
              filterDate={date => !isDateFull(date)}
              min={today}
              disabled={isEdit && !canEditPrice}
              required
              className="w-full px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              ÇIKIŞ TARİHİ
            </label>

            <input
              type="date"
              value={form.cikisTarihi}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  cikisTarihi: e.target.value,
                }))
              }
              filterDate={date => !isDateFull(date)}
              min={form.girisTarihi || today}
              disabled={isEdit && !canEditPrice}
              required
              className="w-full px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              BÖLGE
            </label>
            <input
              value={form.kampBolge}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  kampBolge: e.target.value,
                }))
              }
              disabled={isEdit && !canEditGeneral}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              KAPORA
            </label>
            <input
              type="number"
              value={form.kapora}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  kapora: e.target.value,
                }))
              }
              disabled={isEdit && !canEditPrice}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              ÖDENEN NAKİT
            </label>
            <input
              type="number"
              value={form.odenenNakit}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  odenenNakit: e.target.value,
                }))
              }
              disabled={isEdit && !canEditPrice}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              ÖDENEN KART
            </label>
            <input
              type="number"
              value={form.odenenKart}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  odenenKart: e.target.value,
                }))
              }
              disabled={isEdit && !canEditPrice}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              ÖDENEN HAVALE
            </label>
            <input
              type="number"
              value={form.odenenHavale}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  odenenHavale: e.target.value,
                }))
              }
              disabled={isEdit && !canEditPrice}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              AÇIKLAMA
            </label>
            <textarea
              value={form.aciklama}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  aciklama: e.target.value,
                }))
              }
              disabled={isEdit && !canEditGeneral}
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              TOPLAM NAKİT ÜCRET
            </label>
            <input
              type="text"
              value={`${nakitUcret} ₺`}
              readOnly
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              TOPLAM KART ÜCRET
            </label>
            <input
              type="text"
              value={`${kartUcret} ₺`}
              readOnly
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
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
            onClick={() => navigate('/reservations')}
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
    </div>
  );
}
