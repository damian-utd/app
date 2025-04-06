const { contextBridge, ipcRenderer } = require('electron');

// Eksportowanie API do renderera
contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel, data) => ipcRenderer.send(channel, data),
});


// Przykładowe wywołanie

