import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const clients = new Map();

wss.on('connection', (ws) => {
  ws.send('Por favor, envía tu nombre de usuario con el formato: /nombre tu_nombre');

  ws.on('message', (data) => {
    const message = data.toString().trim();

    if (message.startsWith('/nombre ')) {
      const username = message.replace('/nombre ', '').trim();
      clients.set(ws, username);
      broadcast(`[Servidor]: El usuario "${username}" se ha unido al chat.`, ws);
      return;
    }

    const sender = clients.get(ws);
    if (sender) {
      broadcast(`${sender}: ${message}`, ws);
    }
  });

  ws.on('close', () => {
    const username = clients.get(ws);
    if (username) {
      clients.delete(ws);
      broadcast(`[Servidor]: El usuario "${username}" ha salido del chat.`);
    }
  });
});

function broadcast(message, exclude) {
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN && client !== exclude) {
      client.send(message);
    }
  }
}

console.log('🟢 Servidor WebSocket activo en ws://localhost:8080');
