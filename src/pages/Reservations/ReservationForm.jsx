// src/pages/Reservations/ReservationForm.jsx (güncüllenmiş, Excel kolonlarına uyumlu)
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReservationStore } from '../../store/reservationStore';
import { ArrowLeft } from 'lucide-react';

export default function ReservationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reservations, add, update } = useReservationStore();

  const isEdit = !!id;
  const existing = reservations.find(r => r.id === Number(id));

  const [form, setForm] = useState({
    kod: '',
    isim: '',
    telefon: '',
    tcKimlik: '',
    plaka: '',
    gun: '',
    yetiskin: '',
    cocuk: '',
    cadir: '',
    giris: '',
    cikis: '',
    bolge: '',
    kapora: '',
    nToplam: '',
    kToplam: '',
    öNakit: '',
    öKart: '',
    öHavale: '',
    kalanOdeme: '',
    not: '',
  });

  useEffect(() => {
    if (isEdit && existing) {
      setForm(existing);
    }
  }, [isEdit, existing]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const normalizedForm = {
        ...form,
        gun: Number(form.gun) || 0,
        yetiskin: Number(form.yetiskin) || 0,
        cocuk: Number(form.cocuk) || 0,
        cadir: Number(form.cadir) || 0,
        kapora: Number(form.kapora) || 0,
        nToplam: Number(form.nToplam) || 0,
        kToplam: Number(form.kToplam) || 0,
        öNakit: Number(form.öNakit) || 0,
        öKart: Number(form.öKart) || 0,
        öHavale: Number(form.öHavale) || 0,
        kalanOdeme: Number(form.kalanOdeme) || 0,
      };

      if (isEdit) {
        await update({ ...normalizedForm, id: Number(id) });
      } else {
        await add(normalizedForm);
      }

      navigate('/reservations');
    } catch (err) {
      console.error('Rezervasyon kaydetme hatası:', err);
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
        className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            placeholder="KOD *"
            value={form.kod}
            onChange={e => setForm({ ...form, kod: e.target.value })}
            required
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="İSİM *"
            value={form.isim}
            onChange={e => setForm({ ...form, isim: e.target.value })}
            required
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="TELEFON *"
            value={form.telefon}
            onChange={e => setForm({ ...form, telefon: e.target.value })}
            required
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="TCKİMLİKNO"
            value={form.tcKimlik}
            onChange={e => setForm({ ...form, tcKimlik: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="PLAKA"
            value={form.plaka}
            onChange={e => setForm({ ...form, plaka: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="GÜN *"
            value={form.gun}
            onChange={e =>
              setForm({
                ...form,
                gun: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
            required
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="YETİŞKİN *"
            value={form.yetiskin}
            onChange={e =>
              setForm({
                ...form,
                yetiskin: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
            required
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="ÇOCUK"
            value={form.cocuk}
            onChange={e =>
              setForm({
                ...form,
                cocuk: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="ÇADIR"
            value={form.cadir}
            onChange={e =>
              setForm({
                ...form,
                cadir: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="date"
            placeholder="GİRİŞ *"
            value={form.giris}
            onChange={e => setForm({ ...form, giris: e.target.value })}
            required
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="date"
            placeholder="ÇIKIŞ *"
            value={form.cikis}
            onChange={e => setForm({ ...form, cikis: e.target.value })}
            required
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="BÖLGE"
            value={form.bolge}
            onChange={e => setForm({ ...form, bolge: e.target.value })}
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="KAPORA"
            value={form.kapora}
            onChange={e =>
              setForm({
                ...form,
                kapora: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="N-TOPLAM"
            value={form.nToplam}
            onChange={e =>
              setForm({
                ...form,
                nToplam: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="K-TOPLAM"
            value={form.kToplam}
            onChange={e =>
              setForm({
                ...form,
                kToplam: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="Ö-NAKİT"
            value={form.öNakit}
            onChange={e =>
              setForm({
                ...form,
                öNakit: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="Ö-KART"
            value={form.öKart}
            onChange={e =>
              setForm({
                ...form,
                öKart: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="Ö-HAVALE"
            value={form.öHavale}
            onChange={e =>
              setForm({
                ...form,
                öHavale: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <input
            placeholder="KALAN ÖDEME"
            value={form.kalanOdeme}
            onChange={e =>
              setForm({
                ...form,
                kalanOdeme: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
            className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <textarea
          placeholder="NOT (isteğe bağlı)"
          value={form.not}
          onChange={e => setForm({ ...form, not: e.target.value })}
          rows="4"
          className="w-full px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none resize-none"
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
    </div>
  );
}
