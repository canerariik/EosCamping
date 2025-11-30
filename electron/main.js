const { app, ipcMain } = require("electron");
const sequelize = require("./main/db/index");
const createWindow = require("./main/window");

// IPC modülleri
const authIPC = require("./ipc/auth");
const reservationIPC = require("./ipc/reservation");
const userIPC = require("./ipc/user");

// ---------------- App Başlat ----------------
app.whenReady().then(async () => {
    await sequelize.sync();

    createWindow();
});

// ---------------- IPC --------------------
authIPC(ipcMain);
reservationIPC(ipcMain);
userIPC(ipcMain);

// Kod üretme fonksiyonu
function generateKod() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let kod = "";
    for (let i = 0; i < 3; i++) kod += letters.charAt(Math.floor(Math.random() * letters.length));
    return kod;
}

module.exports = { generateKod };
