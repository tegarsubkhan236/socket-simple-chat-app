const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);

        console.log(`Received message => ${parsedMessage.text}`);

        // Broadcast message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    username: parsedMessage.username,
                    text: parsedMessage.text,
                    time: new Date().toLocaleTimeString(),
                }));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.send(JSON.stringify({
        username: 'Server',
        text: 'Welcome to WebSocket chat server!',
        time: new Date().toLocaleTimeString(),
    }));
});

console.log('WebSocket server is running on ws://localhost:8080');
