// src/pages/UserList.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { Pencil, Trash2, UserPlus } from 'lucide-react';

export default function UserList() {
  const navigate = useNavigate();
  const { users, load, remove } = useUserStore();

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Personel</h1>
        <button
          onClick={() => navigate('/users/new')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" /> Yeni Kullanıcı
        </button>
      </div>

      <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-x-auto">
        <table className="table-auto border-collapse">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-6">Ad Soyad</th>
              <th className="text-left p-6">Kullanıcı Adı</th>
              <th className="text-left p-6">Rol</th>
              <th className="text-right p-6 w-[1%]">İşlem</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr
                key={u.id}
                className="border-t border-slate-800 hover:bg-slate-800/40"
              >
                <td className="p-6 font-medium">
                  {u.isim} {u.soyisim}
                </td>
                <td className="p-6">{u.kullaniciAdi}</td>
                <td className="p-6">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      u.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-6 whitespace-nowrap text-right">
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/users/${u.id}`)}
                      className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg"
                    >
                      <Pencil className="w-5 h-5 text-blue-400" />
                    </button>

                    <button
                      onClick={() => remove(u.id)}
                      className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
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
