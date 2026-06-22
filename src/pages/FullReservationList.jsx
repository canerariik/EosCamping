// src/pages/FullReservationList.jsx
import { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, UserPlus, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useReservationStore } from '../store/reservationStore';
import Pagination from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';

export default function FullReservationList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { reservations, loading, init, remove } = useReservationStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [customerTypeFilter, setCustomerTypeFilter] = useState('');

  const ITEMS_PER_PAGE = 10;

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

  const resetFilters = () => {
    setSearchTerm('');
    setDateFilter({
      start: '',
      end: '',
    });
    setCustomerTypeFilter('');
    setCurrentPage(1);
  };

  const filteredReservations = useMemo(() => {
    return reservations
      .filter(r => {
        if (!searchTerm) return true;
        const t = searchTerm.toLowerCase();

        return (
          r.isim?.toLowerCase().includes(t) ||
          r.soyisim?.toLowerCase().includes(t) ||
          r.telefon?.toLowerCase().includes(t) ||
          r.tcNo?.toLowerCase().includes(t) ||
          r.kod?.toLowerCase().includes(t)
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
      .filter(r => {
        if (!customerTypeFilter) return true;

        if (customerTypeFilter === 'gunluk') {
          return r.gunuBirlikMi === true;
        }

        if (customerTypeFilter === 'randevulu') {
          return r.gunuBirlikMi === false;
        }

        return true;
      })
      .sort((a, b) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const aDate = new Date(a.cikisTarihi);
        const bDate = new Date(b.cikisTarihi);

        aDate.setHours(0, 0, 0, 0);
        bDate.setHours(0, 0, 0, 0);

        const aDiff = aDate - today;
        const bDiff = bDate - today;

        if (aDiff >= 0 && bDiff >= 0) {
          return aDiff - bDiff;
        }

        if (aDiff >= 0) return -1;
        if (bDiff >= 0) return 1;

        return bDiff - aDiff;
      });
  }, [reservations, searchTerm, dateFilter, customerTypeFilter]);

  const { totalItems, totalPages, paginatedData } = usePagination(
    filteredReservations,
    currentPage,
    ITEMS_PER_PAGE,
  );

  if (loading)
    return <div className="text-white text-center">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Konaklamış Kişiler</h1>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-3 items-end">
          <input
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Ara..."
            className="bg-slate-800 border border-slate-700 px-4 h-[42px] rounded-lg text-white w-[240px]"
          />

          <div className="flex flex-col">
            <label className="text-slate-400 text-xs mb-1">Giriş Tarihi</label>
            <input
              type="date"
              value={dateFilter.start}
              onChange={e => {
                setDateFilter(p => ({ ...p, start: e.target.value }));
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 px-3 h-[42px] rounded-lg text-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-slate-400 text-xs mb-1">Çıkış Tarihi</label>
            <input
              type="date"
              value={dateFilter.end}
              onChange={e => {
                setDateFilter(p => ({ ...p, end: e.target.value }));
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 px-3 h-[42px] rounded-lg text-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-slate-400 text-xs mb-1">Müşteri Tipi</label>

            <select
              value={customerTypeFilter}
              onChange={e => {
                setCustomerTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 px-3 h-[42px] rounded-lg text-white"
            >
              <option value="">Tümü</option>

              <option value="randevulu">Kamp Müşteri</option>

              <option value="gunluk">Günlük Müşteri</option>
            </select>
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
        onPageChange={setCurrentPage}
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
                <th className="p-6 text-center align-middle text-white">
                  Rezervasyon Kodu
                </th>

                <th className="p-6 text-center align-middle text-white">
                  Ad Soyad
                </th>

                <th className="p-6 text-center align-middle text-white">
                  Telefon No
                </th>

                <th className="p-6 text-center align-middle text-white">
                  Giriş Tarihi
                </th>

                <th className="p-6 text-center align-middle text-white">
                  Çıkış Tarihi
                </th>

                <th className="p-6 text-center align-middle text-white">
                  Rezervasyon Türü
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="25" className="text-center py-12 text-slate-500">
                    Bu sekmede veri yok
                  </td>
                </tr>
              ) : (
                paginatedData.map(u => {
                  return (
                    <tr
                      key={u.id}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                    >
                      <td className="p-6 text-center align-middle text-white">
                        {u.kod}
                      </td>

                      <td className="p-6 text-center align-middle text-white">
                        {u.isim} {u.soyisim}
                      </td>

                      <td className="p-6 text-center align-middle text-white">
                        {u.telefon}
                      </td>

                      <td className="p-6 text-center align-middle text-white">
                        {format(new Date(u.girisTarihi), 'dd.MM.yyyy')}
                      </td>

                      <td className="p-6 text-center align-middle text-white">
                        {format(new Date(u.cikisTarihi), 'dd.MM.yyyy')}
                      </td>

                      {u.gunuBirlikMi ? (
                        <td className="p-6 text-center align-middle text-white">
                          Günlük Müşteri
                        </td>
                      ) : (
                        <td className="p-6 text-center align-middle text-white">
                          Kamp Müşteri
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
        onPageChange={setCurrentPage}
      />

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
