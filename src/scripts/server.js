// Server WebSocket od ustawień wysyłanych do apki z deską rozdzielczą

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080, host: '0.0.0.0' });


wss.on('connection', (ws) => {
    console.log('Połączono z klientem');

    ws.on('message', (message) => {
        console.log('Otrzymano:', message.toString());

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

// console.log('Serwer WebSocket działa na ws://localhost:8080');

// npm run server
