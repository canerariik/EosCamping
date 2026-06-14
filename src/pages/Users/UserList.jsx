// src/pages/UserList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';

export default function UserList() {
  const navigate = useNavigate();
  const { users, load, remove } = useUserStore();
  const { user } = useAuthStore();
  const [deletingId, setDeletingId] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!confirmUser) return;

    try {
      setDeletingId(confirmUser.id);

      await remove(confirmUser.id);
      toast.success('Kullanıcı silindi.');
      setConfirmUser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Kullanıcılar</h1>

        <button
          type="button"
          onClick={() => navigate('/users/new')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-2 transition"
        >
          <UserPlus className="w-5 h-5" />
          Yeni Kullanıcı
        </button>
      </div>

      <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-x-auto">
        <table className="table-auto border-collapse w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="p-6 text-center align-middle text-white">
                Ad Soyad
              </th>

              <th className="p-6 text-center align-middle text-white">
                Kullanıcı Adı
              </th>

              <th className="p-6 text-center align-middle text-white">Rol</th>

              {user?.role === 'admin' && (
                <th className="p-6 text-center text-white">İşlem</th>
              )}
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr
                key={u.id}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition"
              >
                <td className="p-6 text-center align-middle text-white">
                  {u.isim} {u.soyisim}
                </td>

                <td className="p-6 text-center align-middle text-white">
                  {u.kullaniciAdi}
                </td>

                <td className="p-6 text-center align-middle">
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

                {user?.role === 'admin' && (
                  <td className="p-6 text-center align-middle">
                    <div className="flex gap-3 justify-center">
                      <button
                        type="button"
                        onClick={() => navigate(`/users/edit/${u.id}`)}
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition"
                      >
                        <Pencil className="w-5 h-5 text-blue-400" />
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === u.id}
                        onClick={() => setConfirmUser(u)}
                        className={`p-2 rounded-lg transition ${
                          deletingId === u.id
                            ? 'bg-red-900/40 cursor-not-allowed opacity-60'
                            : 'bg-red-600/20 hover:bg-red-600/40'
                        }`}
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              Kullanıcı Sil
            </h2>

            <p className="text-slate-300 leading-relaxed">
              <span className="font-bold text-white">
                {confirmUser.isim} {confirmUser.soyisim}
              </span>{' '}
              isimli kullanıcıyı silmek istediğinize emin misiniz?
            </p>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                disabled={deletingId === confirmUser.id}
                onClick={handleDelete}
                className={`flex-1 py-4 rounded-xl font-bold transition ${
                  deletingId === confirmUser.id
                    ? 'bg-red-900/40 cursor-not-allowed opacity-60'
                    : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                {deletingId === confirmUser.id ? 'Siliniyor...' : 'Evet, Sil'}
              </button>

              <button
                type="button"
                disabled={deletingId === confirmUser.id}
                onClick={() => setConfirmUser(null)}
                className="flex-1 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
