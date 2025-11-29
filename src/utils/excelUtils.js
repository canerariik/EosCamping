import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DB_PATH = '/data/REZERVASYONKAYIT (1).xlsx';

let cachedData = null;

export const excelUtils = {
    async load() {
        if (cachedData) return cachedData;

        try {
            const response = await fetch(DB_PATH);
            if (!response.ok) throw new Error('Excel dosyası bulunamadı');
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            const sheet = workbook.Sheets['REZERVASYONKAYIT'];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

            // Header'ı al (row 1)
            const headers = jsonData[0];

            // Verileri harita (non-empty rows)
            const reservations = jsonData.slice(2).filter(row => row.some(cell => cell && cell !== 0 && cell !== '')).map(row => {
                return {
                    kod: row[0],
                    isim: row[1],
                    telefon: row[2],
                    tcKimlik: row[3],
                    plaka: row[4],
                    gun: row[5],
                    yetiskin: row[6],
                    cocuk: row[7],
                    cadir: row[8],
                    giris: row[9],
                    cikis: row[10],
                    bolge: row[11],
                    kapora: row[12],
                    nToplam: row[13],
                    kToplam: row[14],
                    oNakit: row[15],
                    oKart: row[16],
                    oHavale: row[17],
                    alacak: row[18],
                    not: row[19],
                    ut: row[20],
                    id: row[21],
                    resep: row[22],
                    kasa: row[23],
                    kampci: row[24]
                };
            });

            cachedData = { reservations };
            return cachedData;
        } catch (err) {
            console.error('Excel yükleme hatası:', err);
            // Dosya yoksa boş başla
            return { reservations: [] };
        }
    },

    async save(data) {
        const wb = XLSX.utils.book_new();

        // Header
        const headers = ['KOD', 'İSİM', 'TELEFON', 'TCKİMLİKNO', 'PLAKA', 'GÜN', 'YETİŞKİN', 'ÇOCUK', 'ÇADIR', 'GİRİŞ', 'ÇIKIŞ', 'BÖLGE', 'KAPORA', 'N-TOPLAM', 'K-TOPLAM', 'Ö-NAKİT', 'Ö-KART', 'Ö-HAVALE', 'ALACAK', 'NOT', 'UT', 'ID', 'RESEP', 'KASA', 'KAMPÇI'];

        // Verileri Excel formatına çevir
        const wsData = [headers, [], ...data.reservations.map(res => [
            res.kod || '',
            res.isim || '',
            res.telefon || '',
            res.tcKimlik || '',
            res.plaka || '',
            res.gun || 0,
            res.yetiskin || 0,
            res.cocuk || 0,
            res.cadir || 0,
            res.giris || '',
            res.cikis || '',
            res.bolge || '',
            res.kapora || 0,
            res.nToplam || 0,
            res.kToplam || 0,
            res.oNakit || 0,
            res.oKart || 0,
            res.oHavale || 0,
            res.alacak || 0,
            res.not || '',
            res.ut || 0,
            res.id || 0,
            res.resep || '',
            res.kasa || 0,
            res.kampci || 0
        ])];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'REZERVASYONKAYIT');

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(blob, 'REZERVASYONKAYIT (1).xlsx');

        cachedData = data;
    },

    async downloadBackup() {
        const data = await this.load();
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data.reservations);
        XLSX.utils.book_append_sheet(wb, ws, 'REZERVASYONKAYIT');
        const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([buf]), `rezervasyon-yedek-${new Date().toISOString().slice(0, 10)}.xlsx`);
    }
};