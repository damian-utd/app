const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Połączono z klientem');

    ws.send('Witaj, kliencie! Serwer mówi cześć.');

    ws.on('message', (message) => {
        console.log('Otrzymano:', message.toString());

        // Rozsyłamy do wszystkich klientów
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('Rozłączono klienta');
    });
});

console.log('Serwer WebSocket działa na ws://localhost:8080');
