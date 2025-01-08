const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("node:path");

let win;

const createWindows = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        }
    })

    win.loadFile(path.join(__dirname, "index.html"));

    ipcMain.on('change-page', (event, fileName) => {
        win.loadFile(path.join(__dirname, fileName)); // Zmiana zawartości okna
    });

}

app.whenReady().then(() => {
    createWindows()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindows()
        }
    })
})