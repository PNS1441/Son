const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        console.log('Received:', message);
        ws.send(`Nhận file: ${JSON.parse(message).fileName}`);
    });
    ws.on('error', (error) => console.error('Server error:', error));
});

console.log('WebSocket server running on ws://localhost:8080');