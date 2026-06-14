const { app, ipcMain, dialog } = require("electron");
const sequelize = require("./main/db/index");
const createWindow = require("./main/window");
const { isActivated, activate } = require("./main/license");

const authIPC = require("./ipc/auth");
const reservationIPC = require("./ipc/reservation");
const userIPC = require("./ipc/user");
const settingIPC = require("./ipc/setting");
const personelIPC = require("./ipc/personel");

ipcMain.handle(
    "license:activate",
    (_, password) => {
        return activate(password);
    }
);

app.disableHardwareAcceleration();

app.whenReady().then(async () => {

    try {
        await sequelize.sync();
    } catch (err) {
        console.error(err);
    }

    const isDev = !app.isPackaged;

    const licensed = isActivated();

    if (!licensed) {

        console.log("[LICENSE] Yok - license mode açılıyor");

        createWindow(true);
        return;
    }

    createWindow(false);
});

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {

    const { BrowserWindow } =
        require("electron");

    if (
        BrowserWindow
            .getAllWindows()
            .length === 0
    ) {

        createWindow();
    }
});

authIPC(ipcMain);
reservationIPC(ipcMain);
userIPC(ipcMain);
settingIPC(ipcMain);
personelIPC(ipcMain);
