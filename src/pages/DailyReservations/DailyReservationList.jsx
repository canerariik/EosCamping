import { useEffect, useState } from 'react';
import { useReservationStore } from '../../store/reservationStore';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';
import { Edit2, Trash2, Plus, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';

export default function DailyReservationList() {
  const { reservations, loading, init, remove } = useReservationStore();
  const { user } = useAuthStore();
  const isPersonel = user?.role === 'personel';
  const isResepsiyon = user?.role === 'resepsiyon';
  const [activeTab, setActiveTab] = useState('aktif');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const [tabPages, setTabPages] = useState({
    aktif: 1,
    cikisGunu: 1,
    bekliyor: 1,
    tamamlandi: 1,
  });

  useEffect(() => {
    init();
  }, []);

  const getStatus = giris => {
    const today = new Date();
    const inDate = new Date(giris);

    today.setHours(0, 0, 0, 0);
    inDate.setHours(0, 0, 0, 0);

    if (today.getTime() === inDate.getTime()) {
      return {
        key: 'aktif',
        text: 'Aktif',
        color: 'bg-green-500/20 text-green-400',
      };
    }

    return {
      key: 'tamamlandi',
      text: 'Tamamlandı',
      color: 'bg-gray-500/20 text-gray-400',
    };
  };

  const filteredReservations = reservations
    .filter(res => res.gunuBirlikMi === true)
    .filter(res => {
      const status = getStatus(res.girisTarihi);
      return status.key === activeTab;
    })
    .sort((a, b) => {
      const dateA = new Date(a.kayitTarihi || a.createdAt || a.girisTarihi);
      const dateB = new Date(b.kayitTarihi || b.createdAt || b.girisTarihi);
      return dateB - dateA;
    })
    .filter(res => {
      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();

      return (
        res.isim?.toLowerCase().includes(term) ||
        res.soyisim?.toLowerCase().includes(term) ||
        res.telefon?.toLowerCase().includes(term) ||
        res.plaka?.toLowerCase().includes(term) ||
        res.tcNo?.toLowerCase().includes(term) ||
        res.kod?.toLowerCase().includes(term) ||
        res.aciklama?.toLowerCase().includes(term)
      );
    });

  const { totalItems, totalPages, currentPage, paginatedData } = usePagination(
    filteredReservations,
    tabPages[activeTab],
    ITEMS_PER_PAGE,
  );

  const getDisplayStatus = res => {
    const realStatus = getStatus(res.girisTarihi);

    if (activeTab === 'aktif') {
      return {
        key: 'aktif',
        text: 'Aktif',
        color: 'bg-green-500/20 text-green-400',
      };
    }

    return realStatus;
  };

  const counts = {
    aktif: reservations.filter(r => {
      if (r.gunuBirlikMi !== true) return false;
      return getStatus(r.girisTarihi).key === 'aktif';
    }).length,

    tamamlandi: reservations.filter(
      r =>
        r.gunuBirlikMi === true &&
        getStatus(r.girisTarihi).key === 'tamamlandi',
    ).length,
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Rezervasyonlar');

    sheet.columns = [
      { header: 'DURUM', key: 'durum', width: 15 },
      { header: 'KOD', key: 'kod', width: 15 },
      { header: 'İSİM', key: 'isim', width: 20 },
      { header: 'SOYİSİM', key: 'soyisim', width: 20 },
      { header: 'TELEFON', key: 'telefon', width: 18 },
      { header: 'TC KİMLİK', key: 'tc', width: 18 },
      { header: 'PLAKA', key: 'plaka', width: 15 },
      { header: 'YETİŞKİN', key: 'yetiskin', width: 12 },
      { header: 'ÇOCUK', key: 'cocuk', width: 12 },
      { header: 'GİRİŞ', key: 'giris', width: 15 },
      { header: 'ÇIKIŞ', key: 'cikis', width: 15 },
      { header: 'GÜN', key: 'gun', width: 10 },
      { header: 'İNDİRİM', key: 'odenenhavale', width: 15 },
      { header: 'NAKİT', key: 'nakit', width: 15 },
      { header: 'KART', key: 'kart', width: 15 },
      { header: 'AÇIKLAMA', key: 'aciklama', width: 25 },
    ];

    sheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E40AF' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    filteredReservations.forEach(res => {
      const status = getDisplayStatus(res);

      sheet.addRow({
        durum: status.text,
        kod: res.kod,
        isim: res.isim,
        soyisim: res.soyisim,
        telefon: res.telefon,
        tc: res.tcNo,
        plaka: res.plaka,
        yetiskin: res.yetiskinSayisi,
        cocuk: res.cocukSayisi,
        giris: format(new Date(res.girisTarihi), 'dd.MM.yyyy'),
        cikis: format(new Date(res.cikisTarihi), 'dd.MM.yyyy'),
        gun: res.gunSayisi,
        odenenhavale: res.odenenhavale,
        nakit: res.nakitUcret,
        kart: res.kartUcret,
        aciklama: res.aciklama,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const file = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const trTime = new Date()
      .toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul', hour12: false })
      .replace(' ', 'T')
      .replaceAll(':', '.');

    saveAs(file, `gunlukRezervasyon_${activeTab}_${trTime}.xlsx`);

    toast.success('Excel indiriliyor..');
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    setDeleting(true);
    await remove(confirmDelete.id, user.id);
    toast.success('Günlük rezervasyon silindi.');
    setConfirmDelete(null);
    setDeleting(false);
  };

  if (loading)
    return <div className="text-center text-2xl text-white">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">
            Günlük Rezervasyonlar
          </h1>

          {(user?.role === 'admin' || user?.role === 'resepsiyon') && (
            <Link
              to="/dailyReservations/new"
              className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              Günlük Rezervasyon
            </Link>
          )}
        </div>

        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex gap-3">
            {[
              { key: 'aktif', label: 'Aktif' },
              { key: 'tamamlandi', label: 'Tamamlandı' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);

                  setTabPages(prev => ({
                    ...prev,
                    [tab.key]: 1,
                  }));
                }}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab.key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {tab.label} ({counts[tab.key]})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToExcel}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Excel İndir
            </button>

            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setTabPages(prev => ({
                  ...prev,
                  [activeTab]: 1,
                }));
              }}
              className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg w-[320px] focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <br />
        <br />

        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={page =>
            setTabPages(prev => ({
              ...prev,
              [activeTab]: page,
            }))
          }
        />

        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
          <table className="min-w-[1500px] w-full">
            <thead className="bg-slate-800/50">
              <tr>
                {[
                  'Durum',
                  'KOD',
                  'İSİM',
                  'SOYİSİM',
                  'TELEFON',
                  'TC',
                  'PLAKA',
                  'YETİŞKİN',
                  'ÇOCUK',
                  'GİRİŞ',
                  'ÇIKIŞ',
                  'GÜN',
                  'İNDİRİM',
                  'NAKİT',
                  'KART',
                  'AÇIKLAMA',
                ].map((h, i) => (
                  <th key={i} className="p-6 text-center text-white">
                    {h}
                  </th>
                ))}

                {!isPersonel && (
                  <th className="p-6 text-center text-white">İşlem</th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan="16" className="text-center py-12 text-slate-500">
                    Bu sekmede veri yok
                  </td>
                </tr>
              ) : (
                paginatedData.map(res => {
                  const status = getDisplayStatus(res);

                  return (
                    <tr key={res.id} className="border-t border-slate-800">
                      <td className="p-6 text-center align-middle">
                        <span
                          className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm whitespace-nowrap min-w-[120px] ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </td>
                      <td className="p-6 text-center">{res.kod}</td>
                      <td className="p-6 text-center">{res.isim}</td>
                      <td className="p-6 text-center">{res.soyisim}</td>
                      <td className="p-6 text-center">{res.telefon}</td>
                      <td className="p-6 text-center">{res.tcNo}</td>
                      <td className="p-6 text-center">{res.plaka}</td>
                      <td className="p-6 text-center">{res.yetiskinSayisi}</td>
                      <td className="p-6 text-center">{res.cocukSayisi}</td>
                      <td className="p-6 text-center">
                        {format(new Date(res.girisTarihi), 'dd.MM.yyyy')}
                      </td>
                      <td className="p-6 text-center">
                        {format(new Date(res.cikisTarihi), 'dd.MM.yyyy')}
                      </td>
                      <td className="p-6 text-center">{res.gunSayisi}</td>
                      <td className="p-6 text-center">{res.odenenHavale}</td>
                      <td className="p-6 text-center">₺{res.nakitUcret}</td>
                      <td className="p-6 text-center">₺{res.kartUcret}</td>
                      <td className="p-6 text-center">{res.aciklama}</td>

                      {!isPersonel && (
                        <td className="p-6 text-center align-middle">
                          <div className="flex gap-2 justify-center">
                            <Link
                              to={`/dailyReservations/edit/${res.id}`}
                              className="p-2 bg-blue-600/30 rounded-lg"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>

                            {!isResepsiyon && (
                              <button
                                onClick={() => setConfirmDelete(res)}
                                className="p-2 bg-red-600/30 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={page =>
            setTabPages(prev => ({
              ...prev,
              [activeTab]: page,
            }))
          }
        />

        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                Günlük Rezervasyon Sil
              </h2>

              <p className="text-slate-300 leading-relaxed">
                <span className="font-bold text-white">
                  {confirmDelete.isim} {confirmDelete.soyisim}
                </span>{' '}
                isimli kullanıcıya ait günlük rezervasyonu silmek istediğinize
                emin misiniz?
              </p>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className={
                    'flex-1 py-4 rounded-xl font-bold transition bg-red-600 hover:bg-red-500'
                  }
                >
                  {deleting ? 'Siliniyor...' : 'Evet, Sil'}
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
