// src/pages/PersonelList.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersonelStore } from '../../store/personelStore';
import { useAuthStore } from '../../store/authStore';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

export default function PersonelInfoList() {
  const navigate = useNavigate();
  const { personels, load, remove } = usePersonelStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmPersonel, setConfirmPersonel] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        await load();
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const sortedPersonels = useMemo(() => {
    return [...personels].sort(
      (a, b) => new Date(b.kayitTarihi || 0) - new Date(a.kayitTarihi || 0),
    );
  }, [personels]);

  const handleDelete = async () => {
    if (!confirmPersonel) return;

    try {
      setDeletingId(confirmPersonel.id);
      await remove(confirmPersonel.id);
      setConfirmPersonel(null);
      toast.success('Kullanıcı silindi.');
      requestAnimationFrame(() => {
        document.body.focus();
      });
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Personel Bilgileri</h1>

        <button
          type="button"
          onClick={() => navigate('/personels/new')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-2 transition"
        >
          <UserPlus className="w-5 h-5" />
          Yeni Personel
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="p-6 text-center text-white">Ad Soyad</th>

              <th className="p-6 text-center text-white">TC No</th>

              <th className="p-6 text-center text-white">Doğum Tarihi</th>

              <th className="p-6 text-center text-white">Adres</th>

              <th className="p-6 text-center text-white">Telefon No</th>

              <th className="p-6 text-center text-white">İşe Giriş Tarihi</th>

              <th className="p-6 text-center text-white">Açıklama</th>

              {user?.role === 'admin' && (
                <th className="p-6 text-center text-white">İşlem</th>
              )}
            </tr>
          </thead>

          <tbody>
            {!loading && sortedPersonels.length === 0 && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-400">
                  Kayıtlı personel bulunamadı.
                </td>
              </tr>
            )}

            {sortedPersonels.map(u => (
              <tr
                key={u.id}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition"
              >
                <td className="p-6 text-center text-white">
                  {u.isim} {u.soyisim}
                </td>

                <td className="p-6 text-center text-white">{u.tcNo || '-'}</td>

                <td className="p-6 text-center text-white">
                  {u.dogumTarihi
                    ? format(new Date(u.dogumTarihi), 'dd.MM.yyyy')
                    : '-'}
                </td>

                <td className="p-6 text-center text-white max-w-[250px] break-words">
                  {u.adres || '-'}
                </td>

                <td className="p-6 text-center text-white">{u.telNo || '-'}</td>

                <td className="p-6 text-center text-white">
                  {u.iseGirisTarihi
                    ? format(new Date(u.iseGirisTarihi), 'dd.MM.yyyy')
                    : '-'}
                </td>

                <td className="p-6 text-center text-white max-w-[300px] break-words">
                  {u.aciklama || '-'}
                </td>

                {user?.role === 'admin' && (
                  <td className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() => navigate(`/personels/edit/${u.id}`)}
                        className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 transition"
                      >
                        <Pencil className="w-5 h-5 text-blue-400" />
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === u.id}
                        onClick={() => setConfirmPersonel(u)}
                        className={`p-2 rounded-lg transition ${
                          deletingId === u.id
                            ? 'bg-red-900/40 opacity-60 cursor-not-allowed'
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

      {confirmPersonel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Personel Sil</h2>

            <p className="text-slate-300 leading-relaxed">
              <span className="font-bold text-white">
                {confirmPersonel.isim} {confirmPersonel.soyisim}
              </span>{' '}
              isimli personeli silmek istediğinize emin misiniz?
            </p>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                disabled={deletingId === confirmPersonel.id}
                onClick={handleDelete}
                className={`flex-1 py-4 rounded-xl font-bold transition ${
                  deletingId === confirmPersonel.id
                    ? 'bg-red-900/40 opacity-60 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                {deletingId === confirmPersonel.id
                  ? 'Siliniyor...'
                  : 'Evet, Sil'}
              </button>

              <button
                type="button"
                disabled={deletingId === confirmPersonel.id}
                onClick={() => setConfirmPersonel(null)}
                className="flex-1 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 transition text-white"
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
