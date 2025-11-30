import { useEffect } from 'react';
import { useReservationStore } from '../../store/reservationStore';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReservationList() {
  const { reservations, loading, init, remove } = useReservationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    init();
  }, []);

  const getStatus = (giris, cikis) => {
    const today = new Date();
    const inDate = new Date(giris);
    const outDate = new Date(cikis);
    if (today >= inDate && today <= outDate)
      return { text: 'Aktif', color: 'bg-green-500/20 text-green-400' };
    if (today > outDate)
      return { text: 'Tamamlandı', color: 'bg-gray-500/20 text-gray-400' };
    return { text: 'Bekliyor', color: 'bg-amber-500/20 text-amber-400' };
  };

  if (loading)
    return <div className="text-center text-2xl text-white">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Rezervasyonlar</h1>
        {(user?.role === 'admin' || user?.role === 'resepsiyon') && (
          <Link
            to="/reservations/new"
            className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl flex items-center gap-3"
          >
            <Plus className="w-5 h-5" /> Yeni Rezervasyon
          </Link>
        )}
      </div>

      <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-x-auto">
        <table className="min-w-[1200px] w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-6">Durum</th>
              <th className="text-left p-6">KOD</th>
              <th className="text-left p-6">İSİM</th>
              <th className="text-left p-6">SOYİSİM</th>
              <th className="text-left p-6">TELEFON</th>
              <th className="text-left p-6">TCKİMLİKNO</th>
              <th className="text-left p-6">PLAKA</th>
              <th className="text-left p-6">YETİŞKİN</th>
              <th className="text-left p-6">ÇOCUK</th>
              <th className="text-left p-6">ÇADIR</th>
              <th className="text-left p-6">GİRİŞ TARİHİ</th>
              <th className="text-left p-6">ÇIKIŞ TARİHİ</th>
              <th className="text-left p-6">GÜN</th>
              <th className="text-left p-6">BÖLGE</th>
              <th className="text-left p-6">KAPORA</th>
              <th className="text-left p-6">NAKİT ÜCRET</th>
              <th className="text-left p-6">KART ÜCRET</th>
              <th className="text-left p-6">ÖDENEN NAKİT</th>
              <th className="text-left p-6">ÖDENEN KART</th>
              <th className="text-left p-6">ÖDENEN HAVALE</th>
              <th className="text-left p-6">KALAN NAKİT ÜCRETİ</th>
              <th className="text-left p-6">KALAN KART ÜCRETİ</th>
              <th className="text-left p-6">AÇIKLAMA</th>
              <th className="text-left p-6">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan="20" className="text-center py-12 text-slate-500">
                  Henüz rezervasyon yok
                </td>
              </tr>
            ) : (
              reservations.map(res => {
                debugger;
                const status = getStatus(res.girisTarihi, res.cikisTarihi);
                return (
                  <tr
                    key={res.id}
                    className="border-t border-slate-800 hover:bg-slate-800/30"
                  >
                    <td className="p-6">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="p-6">{res.kod}</td>
                    <td className="p-6">{res.isim}</td>
                    <td className="p-6">{res.soyisim}</td>
                    <td className="p-6">{res.telefon}</td>
                    <td className="p-6">{res.tcNo}</td>
                    <td className="p-6">{res.plaka}</td>
                    <td className="p-6">{res.yetiskinSayisi || 0}</td>
                    <td className="p-6">{res.cocukSayisi || 0}</td>
                    <td className="p-6">{res.cadirSayisi || 0}</td>
                    <td className="p-6">
                      {format(new Date(res.girisTarihi), 'dd.MM.yyyy')}
                    </td>
                    <td className="p-6">
                      {format(new Date(res.cikisTarihi), 'dd.MM.yyyy')}
                    </td>
                    <td className="p-6">{res.gunSayisi}</td>
                    <td className="p-6">{res.kampBolge}</td>
                    <td className="p-6">
                      ₺{Number(res.kapora || 0).toFixed(2)}
                    </td>
                    <td className="p-6">
                      ₺{Number(res.nakitUcret || 0).toFixed(2)}
                    </td>
                    <td className="p-6">
                      ₺{Number(res.kartUcret || 0).toFixed(2)}
                    </td>
                    <td className="p-6">
                      ₺{Number(res.odenenNakit || 0).toFixed(2)}
                    </td>
                    <td className="p-6">
                      ₺{Number(res.odenenKart || 0).toFixed(2)}
                    </td>
                    <td className="p-6">
                      ₺{Number(res.odenenHavale || 0).toFixed(2)}
                    </td>
                    <td className="p-6">
                      ₺{Number(res.kalanNakitUcret || 0).toFixed(2)}
                    </td>
                    <td className="p-6">
                      ₺{Number(res.kalanKartUcret || 0).toFixed(2)}
                    </td>
                    <td className="p-6">{res.aciklama}</td>
                    <td className="p-6">
                      <div className="flex gap-2">
                        <Link
                          to={`/reservations/edit/${res.id}`}
                          className="p-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => remove(res.id, user.id)}
                          className="p-2 bg-red-600/30 hover:bg-red-600/50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
