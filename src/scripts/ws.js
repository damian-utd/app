//////////////////////////////////////////////////////
// WEBSOCKET

window.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('driver-settings');
    const status = document.getElementById('status');

    // Inicjalizacja WS (jeśli już istnieje, nie zrobi nic)
    window.electronAPI.initWebSocket('ws://192.168.56.1:8080');

    window.addEventListener('ws-open', () => {
        status.textContent = 'Połączono z WebSocketem.';
    });

    window.addEventListener('ws-error', (e) => {
        status.textContent = 'Błąd WebSocket.';
        console.error(e.detail);
    });

    window.addEventListener('ws-close', () => {
        status.textContent = 'Połączenie WebSocket zostało zamknięte.';
    });

    window.addEventListener('ws-message', (event) => {
        console.log('Wiadomość z serwera:', event.detail);
        status.textContent = `Otrzymano od serwera: ${event.detail}`;
    });

    select.addEventListener('change', () => {
        const value = select.value;
        if (value !== '') {
            window.electronAPI.sendWebSocketMessage({type: 'formData', value});
            status.textContent = `Wysłano: ${value}`;
        } else {
            status.textContent = 'Wybierz opcję.';
        }
    });
});



