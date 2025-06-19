const WebSocket = require('ws');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        try {
            const { fileName, data, signature } = JSON.parse(message);
            const buffer = Buffer.from(data.split(',')[1], 'base64');

            const hash = crypto.createHash('sha256').update(data).digest('hex');
            const isValid = hash === signature;

            const savePath = path.join(__dirname, 'uploads', fileName);
            fs.writeFileSync(savePath, buffer);

            const msg = isValid 
                ? `✅ File "${fileName}" hợp lệ và đã lưu.`
                : `❌ File "${fileName}" không hợp lệ!`;

            ws.send(msg);
        } catch (err) {
            console.error('Error:', err);
            ws.send('❌ Lỗi xử lý file!');
        }
    });

    ws.on('error', (error) => console.error('Server error:', error));
});

console.log('WebSocket server running on ws://localhost:8080');
