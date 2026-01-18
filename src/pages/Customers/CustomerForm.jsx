import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    tc: '',
    note: '',
  });

  const handleSubmit = e => {
    e.preventDefault();
    // Burada localStorage'a kaydetme eklenebilir
    alert(isEdit ? 'Müşteri güncellendi!' : 'Müşteri eklendi!');
    navigate('/customers');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-4xl font-bold text-white">
          {isEdit ? 'Müşteri Düzenle' : 'Yeni Müşteri'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 space-y-6"
      >
        <input
          placeholder="Ad Soyad *"
          required
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
        />

        <input
          placeholder="Telefon *"
          required
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          className="w-full px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
        />

        <input
          type="email"
          placeholder="E-posta"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
        />

        <input
          placeholder="TC Kimlik No"
          value={form.tc}
          onChange={e => setForm({ ...form, tc: e.target.value })}
          className="w-full px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:outline-none"
        />

        <textarea
          placeholder="Not (isteğe bağlı)"
          value={form.note}
          onChange={e => setForm({ ...form, note: e.target.value })}
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
            onClick={() => navigate('/customers')}
            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
