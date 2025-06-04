//////////////////////////////////////////////////////
// WEBSOCKET



window.addEventListener('DOMContentLoaded', () => {
    let select = document.getElementById('driver-settings');
    let status = document.getElementById('status');

    // Inicjalizacja WS (jeśli już istnieje, nie zrobi nic)
    window.electronAPI.initWebSocket('ws://82.145.72.152:8080'); // ZUT LAPTOP kabel
    // window.electronAPI.initWebSocket('ws://192.168.56.1:8080'); // ZUT LAPTOP wifi
    // window.electronAPI.initWebSocket('ws://192.168.1.11:8080'); // DOM

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
        let value = parseInt(select.value);
        if (value !== '') {
            window.electronAPI.sendWebSocketMessage({type: 'formData', value});
            status.textContent = `Wysłano: ${value}`;
        } else {
            status.textContent = 'Wybierz opcję.';
        }
    });
});



