import { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react';
import { useReservationStore } from '../../store/reservationStore';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';
import { Edit2, Trash2, Plus, Download, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';

export default function ReservationList() {
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

  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: '',
  });

  const topScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);
  const tableRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(0);
  const syncingRef = useRef(false);

  useEffect(() => {
    init();
  }, []);

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (tableRef.current) {
        setTableWidth(tableRef.current.scrollWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  });

  const handleTopScroll = () => {
    if (syncingRef.current) {
      syncingRef.current = false;
      return;
    }
    if (bottomScrollRef.current && topScrollRef.current) {
      syncingRef.current = true;
      bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
  };

  const handleBottomScroll = () => {
    if (syncingRef.current) {
      syncingRef.current = false;
      return;
    }
    if (topScrollRef.current && bottomScrollRef.current) {
      syncingRef.current = true;
      topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft;
    }
  };

  const getStatus = (giris, cikis) => {
    const now = new Date();

    const trNow = new Date(
      now.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }),
    );

    const inDate = new Date(giris);
    const outDate = new Date(cikis);

    inDate.setHours(0, 0, 0, 0);
    outDate.setHours(0, 0, 0, 0);

    const outDateAt13 = new Date(outDate);
    outDateAt13.setHours(13, 0, 0, 0);

    if (trNow >= outDateAt13) {
      return {
        key: 'tamamlandi',
        text: 'Tamamlandı',
        color: 'bg-gray-500/20 text-gray-400',
      };
    }

    if (trNow.getTime() === outDate.getTime()) {
      return {
        key: 'cikisGunu',
        text: 'Çıkış Günü',
        color: 'bg-red-500/20 text-red-400',
      };
    }

    if (trNow >= inDate && trNow < outDate) {
      return {
        key: 'aktif',
        text: 'Aktif',
        color: 'bg-green-500/20 text-green-400',
      };
    }

    return {
      key: 'bekliyor',
      text: 'Bekliyor',
      color: 'bg-amber-500/20 text-amber-400',
    };
  };

  const filteredReservations = useMemo(() => {
    return reservations
      .filter(r => r.gunuBirlikMi === false)
      .filter(r => {
        const status = getStatus(r.girisTarihi, r.cikisTarihi);

        if (activeTab === 'aktif') {
          return status.key === 'aktif' || status.key === 'cikisGunu';
        }

        return status.key === activeTab;
      })
      .filter(r => {
        if (!searchTerm) return true;
        const t = searchTerm.toLowerCase();

        return (
          r.isim?.toLowerCase().includes(t) ||
          r.soyisim?.toLowerCase().includes(t) ||
          r.telefon?.toLowerCase().includes(t) ||
          r.plaka?.toLowerCase().includes(t) ||
          r.tcNo?.toLowerCase().includes(t) ||
          r.kod?.toLowerCase().includes(t) ||
          r.aciklama?.toLowerCase().includes(t)
        );
      })
      .filter(r => {
        if (!dateFilter.start && !dateFilter.end) return true;

        const g = new Date(r.girisTarihi);
        const c = new Date(r.cikisTarihi);

        const s = dateFilter.start ? new Date(dateFilter.start) : null;
        const e = dateFilter.end ? new Date(dateFilter.end) : null;

        if (s && !e) return g >= s;
        if (!s && e) return c <= e;
        return g >= s && c <= e;
      })
      .sort((a, b) => {
        if (activeTab === 'aktif' || activeTab === 'cikisGunu') {
          const dateA = new Date(a.kayitTarihi || a.createdAt || a.girisTarihi);
          const dateB = new Date(b.kayitTarihi || b.createdAt || b.girisTarihi);
          return dateB - dateA;
        }

        if (activeTab === 'bekliyor') {
          const dateA = new Date(a.girisTarihi);
          const dateB = new Date(b.girisTarihi);
          return dateA - dateB;
        }

        if (activeTab === 'tamamlandi') {
          const dateA = new Date(a.cikisTarihi);
          const dateB = new Date(b.cikisTarihi);
          return dateB - dateA;
        }

        return 0;
      });
  }, [reservations, activeTab, searchTerm, dateFilter]);

  const { totalItems, totalPages, currentPage, paginatedData } = usePagination(
    filteredReservations,
    tabPages[activeTab],
    ITEMS_PER_PAGE,
  );

  const getDisplayStatus = res => {
    const realStatus = getStatus(res.girisTarihi, res.cikisTarihi);

    if (activeTab === 'aktif' && realStatus.key === 'cikisGunu') {
      return {
        key: 'aktif',
        text: 'Aktif',
        color: 'bg-green-500/20 text-green-400',
      };
    }

    return realStatus;
  };

  const counts = useMemo(
    () => ({
      aktif: reservations.filter(r => {
        if (r.gunuBirlikMi !== false) return false;
        const status = getStatus(r.girisTarihi, r.cikisTarihi).key;
        return status === 'aktif' || status === 'cikisGunu';
      }).length,

      cikisGunu: reservations.filter(
        r =>
          r.gunuBirlikMi === false &&
          getStatus(r.girisTarihi, r.cikisTarihi).key === 'cikisGunu',
      ).length,

      bekliyor: reservations.filter(
        r =>
          r.gunuBirlikMi === false &&
          getStatus(r.girisTarihi, r.cikisTarihi).key === 'bekliyor',
      ).length,

      tamamlandi: reservations.filter(
        r =>
          r.gunuBirlikMi === false &&
          getStatus(r.girisTarihi, r.cikisTarihi).key === 'tamamlandi',
      ).length,
    }),
    [reservations],
  );

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
      { header: 'ÇADIR', key: 'cadir', width: 12 },
      { header: 'GİRİŞ', key: 'giris', width: 15 },
      { header: 'ÇIKIŞ', key: 'cikis', width: 15 },
      { header: 'GÜN', key: 'gun', width: 10 },
      { header: 'BÖLGE', key: 'bolge', width: 15 },
      { header: 'AÇIKLAMA', key: 'aciklama', width: 15 },
      { header: 'KAPORA', key: 'kapora', width: 15 },
      { header: 'İNDİRİM', key: 'odenenhavale', width: 15 },
      { header: 'NAKİT TUTAR', key: 'nakit', width: 15 },
      { header: 'KART TUTAR', key: 'kart', width: 15 },
      { header: 'ÖDENEN GÜNCEL TUTAR', key: 'odenennakit', width: 15 },
      { header: 'KALAN NAKİT', key: 'kalannakit', width: 15 },
      { header: 'KALAN KART', key: 'kalankart', width: 15 },
    ];

    sheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E40AF' },
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    });

    filteredReservations.forEach(res => {
      const status = getDisplayStatus(res);

      const row = sheet.addRow({
        durum: status.text,
        kod: res.kod,
        isim: res.isim,
        soyisim: res.soyisim,
        telefon: res.telefon,
        tc: res.tcNo,
        plaka: res.plaka,
        yetiskin: res.yetiskinSayisi,
        cocuk: res.cocukSayisi,
        cadir: res.cadirSayisi,
        giris: format(new Date(res.girisTarihi), 'dd.MM.yyyy'),
        cikis: format(new Date(res.cikisTarihi), 'dd.MM.yyyy'),
        gun: res.gunSayisi,
        bolge: res.kampBolge,
        aciklama: res.aciklama,
        kapora: res.kapora,
        odenenhavale: res.odenenHavale,
        nakit: res.nakitUcret,
        kart: res.kartUcret,
        odenennakit: res.odenenNakit,
        kalannakit: res.kalanNakitUcret,
        kalankart: res.kalanKartUcret,
      });

      let color = 'FFFFFFFF';

      if (status.key === 'aktif') color = 'FF22C55E';
      if (status.key === 'cikisGunu') color = 'FFEF4444';
      if (status.key === 'bekliyor') color = 'FFF59E0B';
      if (status.key === 'tamamlandi') color = 'FF6B7280';

      row.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      };

      row.getCell(1).font = { bold: true };

      row.eachCell(cell => {
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const file = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const trTime = new Date()
      .toLocaleString('sv-SE', {
        timeZone: 'Europe/Istanbul',
        hour12: false,
      })
      .replace(' ', 'T')
      .replaceAll(':', '.');

    saveAs(file, `rezervasyon_${activeTab}_${trTime}.xlsx`);

    toast.success('Excel indiriliyor..');
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    setDeleting(true);
    await remove(confirmDelete.id, user.id);
    toast.success('Kamp rezervasyonu silindi.');
    setConfirmDelete(null);
    setDeleting(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDateFilter({
      start: '',
      end: '',
    });
    setTabPages(prev => ({
      ...prev,
      [activeTab]: 1,
    }));
  };

  if (loading)
    return <div className="text-white text-center">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Rezervasyonlar</h1>

        {(user?.role === 'admin' || user?.role === 'resepsiyon') && (
          <Link
            to="/reservations/new"
            className="bg-emerald-600 hover:bg-emerald-500 px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Rezervasyon
          </Link>
        )}
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'aktif', label: 'Aktif' },
            { key: 'cikisGunu', label: 'Çıkış Günü' },
            { key: 'bekliyor', label: 'Gelecek Rezervasyon' },
            { key: 'tamamlandi', label: 'Tamamlandı' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => {
                setActiveTab(t.key);
                setTabPages(p => ({ ...p, [t.key]: 1 }));
              }}
              className={`px-4 py-2 rounded-lg ${
                activeTab === t.key
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {t.label} ({counts[t.key]})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 items-end">
          <button
            onClick={exportToExcel}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 h-[42px]"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>

          <input
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setTabPages(p => ({ ...p, [activeTab]: 1 }));
            }}
            placeholder="Ara..."
            className="bg-slate-800 border border-slate-700 px-4 h-[42px] rounded-lg text-white w-[240px]"
          />

          <div className="flex flex-col">
            <label className="text-slate-400 text-xs mb-1">Giriş Tarihi</label>
            <input
              type="date"
              value={dateFilter.start}
              onChange={e =>
                setDateFilter(p => ({ ...p, start: e.target.value }))
              }
              className="bg-slate-800 border border-slate-700 px-3 h-[42px] rounded-lg text-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-slate-400 text-xs mb-1">Çıkış Tarihi</label>
            <input
              type="date"
              value={dateFilter.end}
              onChange={e =>
                setDateFilter(p => ({ ...p, end: e.target.value }))
              }
              className="bg-slate-800 border border-slate-700 px-3 h-[42px] rounded-lg text-white"
            />
          </div>

          <button
            onClick={resetFilters}
            className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg flex items-center gap-2 text-white transition shadow h-[42px]"
          >
            <RotateCcw className="w-4 h-4" />
            Temizle
          </button>
        </div>
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

      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div
          ref={topScrollRef}
          onScroll={handleTopScroll}
          data-testid="reservation-table-top-scroll"
          className="overflow-x-auto"
        >
          <div style={{ width: tableWidth, height: 1 }} />
        </div>

        <div
          ref={bottomScrollRef}
          onScroll={handleBottomScroll}
          className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)]"
        >
          <table ref={tableRef} className="min-w-[1500px] w-full">
            <thead className="bg-slate-800 sticky top-0 z-10">
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
                  'ÇADIR',
                  'GİRİŞ',
                  'ÇIKIŞ',
                  'GÜN',
                  'BÖLGE',
                  'AÇIKLAMA',
                  'KAPORA',
                  'İNDİRİM',
                  'NAKİT',
                  'KART',
                  'KALAN NAKİT',
                  'KALAN KART',
                ].map((h, i) => (
                  <th
                    key={i}
                    className="p-6 text-center align-middle text-white"
                  >
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
                  <td colSpan="25" className="text-center py-12 text-slate-500">
                    Bu sekmede veri yok
                  </td>
                </tr>
              ) : (
                paginatedData.map(res => {
                  const status = getDisplayStatus(res);

                  return (
                    <tr
                      key={res.id}
                      className="border-t border-slate-800 hover:bg-slate-800/30"
                    >
                      <td className="p-6 text-center align-middle">
                        <span
                          className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm whitespace-nowrap min-w-[120px] ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </td>

                      <td className="p-6 text-center align-middle">
                        {res.kod}
                      </td>

                      <td className="p-6 text-center align-middle">
                        {res.isim}
                      </td>

                      <td className="p-6 text-center align-middle">
                        {res.soyisim}
                      </td>

                      <td className="p-6 text-center align-middle">
                        {res.telefon}
                      </td>

                      <td className="p-6 text-center align-middle">
                        {res.tcNo}
                      </td>

                      <td className="p-6 text-center align-middle">
                        {res.plaka}
                      </td>

                      <td className="p-6 text-center align-middle">
                        {res.yetiskinSayisi}
                      </td>

                      <td className="p-6 text-center align-middle">
                        {res.cocukSayisi}
                      </td>

                      <td className="p-6 text-center align-middle">
                        {res.cadirSayisi}
                      </td>

                      <td className="p-6 text-center align-middle">
                        {format(new Date(res.girisTarihi), 'dd.MM.yyyy')}
                      </td>

                      <td className="p-6 text-center align-middle">
                        {format(new Date(res.cikisTarihi), 'dd.MM.yyyy')}
                      </td>

                      <td className="p-6 text-center align-middle">
                        {res.gunSayisi}
                      </td>

                      <td className="p-6 text-center align-middle">
                        {res.kampBolge}
                      </td>

                      <td className="p-6 text-center align-middle">
                        {res.aciklama}
                      </td>

                      <td className="p-6 text-center align-middle">
                        ₺{res.kapora}
                      </td>

                      <td className="p-6 text-center align-middle">
                        ₺{res.odenenHavale}
                      </td>

                      <td className="p-6 text-center align-middle">
                        ₺{res.nakitUcret}
                      </td>

                      <td className="p-6 text-center align-middle">
                        ₺{res.kartUcret}
                      </td>

                      <td className="p-6 text-center align-middle">
                        ₺{res.kalanNakitUcret}
                      </td>

                      <td className="p-6 text-center align-middle">
                        ₺{res.kalanKartUcret}
                      </td>

                      {!isPersonel && (
                        <td className="p-6 text-center align-middle">
                          <div className="flex gap-2 justify-center">
                            <Link
                              to={`/reservations/edit/${res.id}`}
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
              Kamp Rezervasyon Sil
            </h2>

            <p className="text-slate-300 leading-relaxed">
              <span className="font-bold text-white">
                {confirmDelete.isim} {confirmDelete.soyisim}
              </span>{' '}
              isimli kullanıcıya ait kamp rezervasyonunu silmek istediğinize
              emin misiniz?
            </p>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-4 rounded-xl font-bold transition bg-red-600 hover:bg-red-500"
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
