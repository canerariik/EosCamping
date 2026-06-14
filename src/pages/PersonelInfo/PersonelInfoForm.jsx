// src/pages/PersonelForm.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePersonelStore } from '../../store/personelStore';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function PersonelInfoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { personels, add, update } = usePersonelStore();
  const [loading, setLoading] = useState(false);
  const isEdit = !!id;
  const existing = personels.find(u => String(u.id) === String(id));

  const emptyForm = {
    isim: '',
    soyisim: '',
    tcNo: '',
    dogumTarihi: '',
    adres: '',
    telNo: '',
    iseGirisTarihi: '',
    aciklama: '',
    kayitDurumu: true,
    kayitTarihi: new Date(),
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (isEdit && existing) {
      setForm({
        isim: existing.isim || '',
        soyisim: existing.soyisim || '',
        tcNo: existing.tcNo || '',
        dogumTarihi: existing.dogumTarihi || '',
        adres: existing.adres || '',
        telNo: existing.telNo || '',
        iseGirisTarihi: existing.iseGirisTarihi || '',
        aciklama: existing.aciklama || '',
        kayitDurumu: existing.kayitDurumu ?? true,
        kayitTarihi: existing.kayitTarihi || new Date(),
      });
    } else {
      setForm(emptyForm);
    }
  }, [isEdit, existing]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      if (isEdit) {
        await update({
          ...form,
          id,
        });
        toast.success('Personel güncellendi.');
      } else {
        await add(form);
        toast.success('Personel oluşturuldu.');
        setForm(emptyForm);
      }

      requestAnimationFrame(() => {
        navigate('/personels');
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
          {isEdit ? 'Personel Düzenle' : 'Yeni Personel'}
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
              TC KİMLİK NUMARASI
            </label>
            <input
              type="text"
              value={form.tcNo}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  tcNo: e.target.value,
                }))
              }
              required
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              DOĞUM TARİHİ
            </label>
            <DatePicker
              selected={
                form.dogumTarihi ? new Date(form.dogumTarihi) : undefined
              }
              onChange={date =>
                setForm({
                  ...form,
                  dogumTarihi: format(date, 'yyyy-MM-dd'),
                })
              }
              required
              withPortal
              dateFormat="dd.MM.yyyy"
              locale={tr}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              yearDropdownItemNumber={50}
              scrollableYearDropdown
              className="w-full px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              ADRES
            </label>
            <textarea
              value={form.adres}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  adres: e.target.value,
                }))
              }
              required
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              TELEFON
            </label>
            <input
              type="text"
              value={form.telNo}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  telNo: e.target.value,
                }))
              }
              required
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300 font-bold text-white">
              İŞE GİRİŞ TARİHİ
            </label>
            <DatePicker
              selected={
                form.iseGirisTarihi ? new Date(form.iseGirisTarihi) : undefined
              }
              onChange={date =>
                setForm(prev => ({
                  ...prev,
                  iseGirisTarihi: format(date, 'yyyy-MM-dd'),
                }))
              }
              required
              withPortal
              dateFormat="dd.MM.yyyy"
              className="w-full px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white"
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
              className="px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white resize-none"
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
            onClick={() => navigate('/personels')}
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
        `}
      </style>
    </div>
  );
}
