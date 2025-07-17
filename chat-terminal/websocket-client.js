import WebSocket from 'ws';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ws = new WebSocket('ws://localhost:8080');

let username = '';

ws.on('open', () => {
  rl.question('Bienvenido al chat. Por favor, ingresa tu nombre de usuario: ', (name) => {
    username = name.trim();
    ws.send(`/nombre ${username}`);
    console.log(`Conectado al chat como "${username}".`);
    prompt();
  });
});

ws.on('message', (data) => {
  console.log(data.toString());
});

ws.on('close', () => {
  console.log('[Servidor]: Desconectado del servidor.');
  process.exit();
});

function prompt() {
  rl.question('', (msg) => {
    ws.send(msg.trim());
    prompt();
  });
}
