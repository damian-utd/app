const { contextBridge, ipcRenderer } = require('electron');

let socket;

contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    getWindowSources: () => ipcRenderer.invoke('get-window-sources'),

    initWebSocket: (url) => {
        if (socket) return; // zapobiegaj tworzeniu ponownie

        socket = new WebSocket(url);

        socket.addEventListener('open', () => {
            console.log('[WS] Połączono z serwerem');
            window.dispatchEvent(new CustomEvent('ws-open'));
        });

        socket.addEventListener('error', (e) => {
            console.error('[WS] Błąd WebSocket:', e);
            window.dispatchEvent(new CustomEvent('ws-error', { detail: e }));
        });

        socket.addEventListener('message', (msg) => {
            console.log('[WS] Otrzymano:', msg.data);
            window.dispatchEvent(new CustomEvent('ws-message', { detail: msg.data }));
        });

        socket.addEventListener('close', () => {
            console.log('[WS] Połączenie zamknięte');
            window.dispatchEvent(new CustomEvent('ws-close'));
            socket = null;
        });
    },

    sendWebSocketMessage: (data) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
        } else {
            console.warn('[WS] Nie można wysłać - brak połączenia');
        }
    },
    startPHP: () => ipcRenderer.send('start-php'),
    stopPHP: () => ipcRenderer.send('stop-php'),
    startPython: (param) => ipcRenderer.send('start-python', param)
});
