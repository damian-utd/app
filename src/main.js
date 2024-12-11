const { app, BrowserWindow } = require('electron');

const createWindows = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile('src/index.html');
}

app.whenReady().then(() => {
    createWindows()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindows()
        }
    })
})