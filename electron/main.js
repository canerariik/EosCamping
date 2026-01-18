const { app, ipcMain } = require("electron");
const sequelize = require("./main/db/index");
const createWindow = require("./main/window");

// IPC modülleri
const authIPC = require("./ipc/auth");
const reservationIPC = require("./ipc/reservation");
const userIPC = require("./ipc/user");
const settingIPC = require("./ipc/setting");

// ---------------- App Başlat ----------------
app.whenReady().then(async () => {
    await sequelize.sync();

    createWindow();
});

// ---------------- IPC --------------------
authIPC(ipcMain);
reservationIPC(ipcMain);
userIPC(ipcMain);
settingIPC(ipcMain);
