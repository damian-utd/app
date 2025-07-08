const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');

const path = require("node:path");
const { spawn } = require('child_process');

let win;

let phpProcess = null;

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

// obraz ets2
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

app.whenReady().then(() => {
    ipcMain.on('start-php', () => {
        console.log('[MAIN] Starting telemetry.php');
        if (!phpProcess) {
            const scriptPath = path.resolve(__dirname, 'db/telemetry.php');
            phpProcess = spawn('php', [scriptPath]);

            phpProcess.on('error', (err) => {
                console.error('[MAIN] Błąd przy uruchamianiu PHP:', err);
            });

            phpProcess.stdout.on('data', (data) => {
                console.log(`PHP: ${data}`);
            });
        }
    });

    ipcMain.on('stop-php', () => {
        if (phpProcess) {
            console.log('[MAIN] Stopping telemetry.php');
            // Zakończ pierwszy proces
            phpProcess.kill('SIGTERM');
            phpProcess = null;

            // Teraz odpalamy raport.php
            const reportPath = path.resolve(__dirname, 'db/raport.php');
            const reportProcess = spawn('php', [reportPath]);

            reportProcess.on('error', (err) => {
                console.error('[MAIN] Blad przy uruchamianiu raport.php:', err);
            });

            reportProcess.stdout.on('data', (data) => {
                console.log(`RAPORT: ${data}`);
            });

            reportProcess.on('exit', (code, signal) => {
                console.log(`[MAIN] raport.php zakonczony (kod: ${code}, sygnal: ${signal})`);
            });
        }
    });
});


// start-python
let pythonProcess = null;

app.whenReady().then(() => {
    ipcMain.on('start-python', (event, param) => {
        if (pythonProcess) {
            console.log('Python już dziala');
            return;
        }

        const args = [path.join(__dirname, '../exports/pdf.py'), ...(Array.isArray(param) ? param : [param])];
        pythonProcess = spawn('python', args);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`Python stdout: ${data.toString()}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python stderr: ${data.toString()}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python zakonczyl dzialanie z kodem ${code}`);
            pythonProcess = null;
        });

        console.log('Uruchomiono Pythona');
    })
})