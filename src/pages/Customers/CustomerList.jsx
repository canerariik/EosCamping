import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockCustomers = [
  {
    id: 1,
    name: 'Ali Veli',
    phone: '0532 123 45 67',
    email: 'ali@example.com',
    tc: '12345678901',
    note: 'Düzenli müşteri',
  },
  {
    id: 2,
    name: 'Ayşe Yılmaz',
    phone: '0555 987 65 43',
    email: 'ayse@example.com',
    tc: '98765432109',
    note: '',
  },
];

export default function CustomerList() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Müşteriler</h1>
        <Link
          to="/customers/new"
          className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl flex items-center gap-3"
        >
          <Plus className="w-5 h-5" /> Yeni Müşteri
        </Link>
      </div>

      <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-6">Ad Soyad</th>
              <th className="text-left p-6">Telefon</th>
              <th className="text-left p-6">E-posta</th>
              <th className="text-left p-6">TC Kimlik</th>
              <th className="text-left p-6">Not</th>
              <th className="text-left p-6">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {mockCustomers.map(c => (
              <tr
                key={c.id}
                className="border-t border-slate-800 hover:bg-slate-800/30"
              >
                <td className="p-6 font-medium">{c.name}</td>
                <td className="p-6">{c.phone}</td>
                <td className="p-6">{c.email}</td>
                <td className="p-6">{c.tc}</td>
                <td className="p-6 text-slate-400">{c.note || '-'}</td>
                <td className="p-6">
                  <div className="flex gap-2">
                    <Link
                      to={`/customers/edit/${c.id}`}
                      className="p-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button className="p-2 bg-red-600/30 hover:bg-red-600/50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
