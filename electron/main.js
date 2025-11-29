// electron/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const XlsxPopulate = require('xlsx-populate');

// --------------------- VERİ KLASÖRÜ ve EXCEL YOLU ---------------------
const DATA_DIR = path.join(os.homedir(), 'Desktop', 'data');
const EXCEL_PATH = path.join(DATA_DIR, 'RezervasyonKayit.xlsx');
console.log('EXCEL_PATH:', EXCEL_PATH);

// --------------------- DATA KLASÖRÜ ---------------------
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Data klasörü oluşturuldu →', DATA_DIR);
} else {
    console.log('Data klasörü mevcut →', DATA_DIR);
}

// --------------------- EXCEL OLUŞTURMA ---------------------
async function createExcelIfMissing() {
    if (fs.existsSync(EXCEL_PATH)) return;

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.name("REZERVASYONKAYIT");

    const headers = [
        'UT', 'KOD', 'İSİM', 'TELEFON', 'TCKİMLİKNO', 'PLAKA',
        'GÜN', 'YETİŞKİN', 'ÇOCUK', 'ÇADIR', 'GİRİŞ', 'ÇIKIŞ',
        'BÖLGE', 'KAPORA', 'N-TOPLAM', 'K-TOPLAM', 'Ö-NAKİT', 'Ö-KART',
        'Ö-HAVALE', 'KALAN ÖDEME', 'NOT', 'Durum', 'İşlem'
    ];

    // Tek satıra başlık ekle ve stil uygula
    headers.forEach((header, idx) => {
        sheet.row(1).cell(idx + 1).value(header);
    });

    sheet.range("A1:W1").style({
        bold: true,
        fill: "0000FF",
        fontColor: "FFFFFF",
        horizontalAlignment: "center"
    });

    await workbook.toFileAsync(EXCEL_PATH);
    console.log("Yeni Excel oluşturuldu →", EXCEL_PATH);
}

// Başlatırken Excel yoksa oluştur
createExcelIfMissing();

// --------------------- ANA PENCERE OLUŞTUR ---------------------
function createWindow() {
    const win = new BrowserWindow({
        width: 1500,
        height: 900,
        backgroundColor: '#0f172a',
        show: false,
        title: 'CampFlow - Kamp Yönetim Sistemi',
        icon: path.join(__dirname, '..', 'public', 'icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    const isDev = !app.isPackaged;

    if (isDev) {
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
    }

    win.once('ready-to-show', () => win.show());
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// --------------------- IPC (Excel okuma/yazma) ---------------------
ipcMain.handle('read-excel', async () => {
    try {
        if (!fs.existsSync(EXCEL_PATH)) return [];

        const workbook = await XlsxPopulate.fromFileAsync(EXCEL_PATH);
        const sheet = workbook.sheet("REZERVASYONKAYIT");
        if (!sheet) return [];

        const usedRange = sheet.usedRange();
        const values = usedRange.value(); // 2D array

        const rows = values.slice(1); // header sonrası
        return rows.map((row, index) => ({
            ut: row[0] || '',
            kod: row[1] || '',
            isim: row[2] || '',
            telefon: row[3] || '',
            tcKimlik: row[4] || '',
            plaka: row[5] || '',
            gun: Number(row[6]) || 0,
            yetiskin: Number(row[7]) || 0,
            cocuk: Number(row[8]) || 0,
            cadir: Number(row[9]) || 0,
            giris: row[10] || '',
            cikis: row[11] || '',
            bolge: row[12] || '',
            kapora: Number(row[13]) || 0,
            nToplam: Number(row[14]) || 0,
            kToplam: Number(row[15]) || 0,
            öNakit: Number(row[16]) || 0,
            öKart: Number(row[17]) || 0,
            öHavale: Number(row[18]) || 0,
            kalanOdeme: Number(row[19]) || 0,
            not: row[20] || '',
            durum: row[21] || '',
            islem: row[22] || '',
            id: index
        })).filter(r => r.isim !== '');
    } catch (err) {
        console.error('Excel okuma hatası:', err);
        return [];
    }
});

ipcMain.handle('write-excel', async (event, data) => {
    try {
        const headers = [
            'UT', 'KOD', 'İSİM', 'TELEFON', 'TCKİMLİKNO', 'PLAKA',
            'GÜN', 'YETİŞKİN', 'ÇOCUK', 'ÇADIR', 'GİRİŞ', 'ÇIKIŞ',
            'BÖLGE', 'KAPORA', 'N-TOPLAM', 'K-TOPLAM', 'Ö-NAKİT', 'Ö-KART',
            'Ö-HAVALE', 'KALAN ÖDEME', 'NOT', 'Durum', 'İşlem'
        ];

        // Yeni boş workbook oluştur
        const workbook = await XlsxPopulate.fromBlankAsync();
        const sheet = workbook.sheet(0);
        sheet.name("REZERVASYONKAYIT");

        // Başlıkları ayrı hücrelere yaz
        headers.forEach((header, idx) => {
            sheet.row(1).cell(idx + 1).value(header);
        });

        // Başlık stilini uygula
        sheet.range("A1:W1").style({
            bold: true,
            fill: "0000FF",
            fontColor: "FFFFFF",
            horizontalAlignment: "center"
        });

        // Verileri ayrı hücrelere yaz
        data.reservations.forEach((r, rowIdx) => {
            const row = [
                r.ut || '',
                r.kod || '',
                r.isim || '',
                r.telefon || '',
                r.tcKimlik || '',
                r.plaka || '',
                Number(r.gun) || 0,
                Number(r.yetiskin) || 0,
                Number(r.cocuk) || 0,
                Number(r.cadir) || 0,
                r.giris || '',
                r.cikis || '',
                r.bolge || '',
                Number(r.kapora) || 0,
                Number(r.nToplam) || 0,
                Number(r.kToplam) || 0,
                Number(r.öNakit) || 0,
                Number(r.öKart) || 0,
                Number(r.öHavale) || 0,
                Number(r.kalanOdeme) || 0,
                r.not || '',
                r.durum || '',
                r.islem || ''
            ];

            // Hücre hücre yaz
            row.forEach((cellValue, colIdx) => {
                sheet.row(rowIdx + 2).cell(colIdx + 1).value(cellValue);
            });
        });

        // Excel dosyasını kaydet
        await workbook.toFileAsync(EXCEL_PATH);
        console.log("Excel kaydedildi →", EXCEL_PATH);
        return true;
    } catch (err) {
        console.error('Excel yazma hatası:', err);
        return false;
    }
});

