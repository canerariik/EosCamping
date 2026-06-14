const { BrowserWindow, app } = require("electron");
const path = require("path");

function createWindow(showLicensePage = false) {

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

    if (isDev) {

        if (showLicensePage) {

            win.loadURL("http://localhost:5173/#/license");

        } else {

            win.loadURL("http://localhost:5173");
        }

    }
    else {

        const indexPath = path.join(__dirname, "../../dist/index.html");

        if (showLicensePage) {

            win.loadFile(
                indexPath,
                {
                    hash: "/license"
                }
            ).catch((err) => {

                console.error(
                    "[CampFlow] license page yüklenemedi:",
                    err
                );
            });
        }
        else {

            win.loadFile(indexPath)
                .catch((err) => {

                    console.error(
                        "[CampFlow] index.html yüklenemedi:",
                        err
                    );

                    console.error(
                        "[CampFlow] Aranan yol:",
                        indexPath
                    );
                });
        }
    }

    win.webContents.on(
        "did-fail-load",
        (
            event,
            errorCode,
            errorDescription,
            validatedURL
        ) => {

            console.error(
                `[CampFlow] did-fail-load: code=${errorCode} desc=${errorDescription} url=${validatedURL}`
            );

            if (!isDev) {

                win.webContents.openDevTools({
                    mode: "detach"
                });
            }
        }
    );

    win.webContents.on(
        "render-process-gone",
        (event, details) => {

            console.error(
                "[CampFlow] render-process-gone:",
                details
            );
        }
    );

    return win;
}

module.exports = createWindow;