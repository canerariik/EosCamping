import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReservationStore } from '../../store/reservationStore';
import { ArrowLeft } from 'lucide-react';

export default function ReservationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reservations, add, update } = useReservationStore();

  const isEdit = !!id;
  const existing = reservations.find(r => r.id === id);

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
    if (isEdit && existing) setForm(existing);
  }, [isEdit, existing]);

  const handleSubmit = async e => {
    e.preventDefault();

    // Number normalize
    const yetiskinSayisi = Number(form.yetiskinSayisi) || 0;
    const cocukSayisi = Number(form.cocukSayisi) || 0;
    const kapora = Number(form.kapora) || 0;

    const odenenNakit = Number(form.odenenNakit) || 0;
    const odenenKart = Number(form.odenenKart) || 0;
    const odenenHavale = Number(form.odenenHavale) || 0;

    // Gün hesaplama
    const diff =
      (new Date(form.cikisTarihi) - new Date(form.girisTarihi)) /
      (1000 * 60 * 60 * 24);

    const gunSayisi = Math.max(1, Math.round(diff)); // minimum 1 gün

    // Ücret hesaplama
    const nakitUcret =
      gunSayisi * (yetiskinSayisi * 1000 + cocukSayisi * 650) - kapora;

    const kartUcret = Number((nakitUcret * 1.1).toFixed(2));

    // Kalan hesaplama
    const kalanNakitUcret = Number(
      Math.max(0, nakitUcret - (odenenNakit + odenenHavale)).toFixed(2)
    );

    const kalanKartUcret = Number(
      Math.max(0, kartUcret - odenenKart).toFixed(2)
    );

    const payload = {
      ...form,
      yetiskinSayisi,
      cocukSayisi,
      cadirSayisi: Number(form.cadirSayisi) || 0,
      gunSayisi,
      kapora,
      nakitUcret: Number(nakitUcret.toFixed(2)),
      kartUcret,
      odenenNakit,
      odenenKart,
      odenenHavale,
      kalanNakitUcret,
      kalanKartUcret,
    };

    if (isEdit) await update({ ...payload, id });
    else await add(payload);

    navigate('/reservations');
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
            placeholder="TELEFON"
            value={form.telefon}
            onChange={e => setForm({ ...form, telefon: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="TCKİMLİKNO"
            value={form.tcNo}
            onChange={e => setForm({ ...form, tcNo: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="PLAKA"
            value={form.plaka}
            onChange={e => setForm({ ...form, plaka: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="YETİŞKİN"
            value={form.yetiskinSayisi}
            onChange={e => setForm({ ...form, yetiskinSayisi: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="ÇOCUK"
            value={form.cocukSayisi}
            onChange={e => setForm({ ...form, cocukSayisi: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="ÇADIR"
            value={form.cadirSayisi}
            onChange={e => setForm({ ...form, cadirSayisi: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="date"
            placeholder="GİRİŞ TARİHİ"
            value={form.girisTarihi}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setForm({ ...form, girisTarihi: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="date"
            placeholder="ÇIKIŞ TARİHİ"
            value={form.cikisTarihi}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setForm({ ...form, cikisTarihi: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="BÖLGE"
            value={form.kampBolge}
            onChange={e => setForm({ ...form, kampBolge: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="KAPORA"
            value={form.kapora}
            onChange={e => setForm({ ...form, kapora: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="ÖDENEN NAKİT"
            value={form.odenenNakit}
            onChange={e => setForm({ ...form, odenenNakit: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="ÖDENEN KART"
            value={form.odenenKart}
            onChange={e => setForm({ ...form, odenenKart: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="ÖDENEN HAVALE"
            value={form.odenenHavale}
            onChange={e => setForm({ ...form, odenenHavale: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <textarea
          placeholder="AÇIKLAMA"
          value={form.aciklama}
          onChange={e => setForm({ ...form, aciklama: e.target.value })}
          rows="4"
          className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
        ></textarea>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-lg"
          >
            {isEdit ? 'Güncelle' : 'Kaydet'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/reservations')}
            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl"
          >
            İptal
          </button>
        </div>
      </form>
      <style>
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
      </style>
    </div>
  );
}
