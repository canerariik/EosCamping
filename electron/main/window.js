const { BrowserWindow, app } = require("electron");
const path = require("path");

async function createWindow() {
    const win = new BrowserWindow({
        width: 1500,
        height: 900,
        backgroundColor: "#0f172a",
        webPreferences: {
            preload: path.join(__dirname, "../preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    const isDev = !app.isPackaged;
    if (isDev) win.loadURL("http://localhost:5173");
    else win.loadFile(path.join(__dirname, "../../dist/index.html"));
}

module.exports = createWindow;
