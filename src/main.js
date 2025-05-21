const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');

const path = require("node:path");

let win;

const createWindows = () => {
    win = new BrowserWindow({
        // width: 800,
        // height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        }
    })
    win.maximize();
    win.loadFile(path.join(__dirname, "index.html"));

    ipcMain.on('change-page', (event, fileName) => {
        win.loadFile(path.join(__dirname, fileName)); // Zmiana zawartości okna
    });

}

app.whenReady().then(createWindows);

app.whenReady().then(() => {

    ipcMain.handle('get-window-sources', async () => {
        console.log('[MAIN] Handler wywolany'); // Bez polskich znaków

        // Pobierz wszystkie dostępne źródła
        const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });

        // Sprawdzamy, czy mamy jakieś źródła
        if (!sources.length) {
            throw new Error('Brak dostepnych zrodel ekranu.'); // Bez polskich znaków
        }

        // Szukamy okna ETS2
        const selectedSource = sources.find(source => source.name.toLowerCase().includes('euro truck simulator 2')); // Zmieniliśmy na nazwę gry

        if (!selectedSource) {
            throw new Error('Nie znaleziono okna ETS2.'); // Bez polskich znaków
        }

        console.log('Przechwytywane zrodlo:', selectedSource.name); // Bez polskich znaków

        // Zwróć ID wybranego źródła
        return selectedSource.id;
    });


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindows()
        }
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
})