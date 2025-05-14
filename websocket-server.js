import { WebSocketServer } from "ws";
import chalk from 'chalk';

const server = new WebSocketServer({ port: 8080 });

let clients = [];

// Manejo de conexiones
server.on("connection", (socket) => {
  let username = null;

  // Mensaje de bienvenida
  socket.send("Bienvenido al chat. Por favor, ingresa tu nombre de usuario:");

  // Capturar el nombre de usuario
  socket.on("message", (message) => {
    if (!username) {
      username = message.toString();
      clients.push({ username, socket });
      broadcast(`[Servidor]: El usuario "${username}" se ha unido al chat.`);
    } else {
      broadcast(`${username}: ${message}`);
    }
  });

  // Desconexión del cliente
  socket.on("close", () => {
    clients = clients.filter(client => client.socket !== socket);
    broadcast(`[Servidor]: El usuario "${username}" ha salido del chat.`);
  });
});

// Función para retransmitir mensajes a todos los clientes
function broadcast(message) {
  clients.forEach(client => {
    client.socket.send(message);
  });
}

function broadcastServerMessage(text) {
  const formatted = `[Servidor]: ${text}`;
  console.log(chalk.green(formatted)); // Visibilidad en el terminal del servidor
  broadcast(formatted); // Envío a todos los clientes conectados
}

setTimeout(() => {
  broadcastServerMessage("El chat se cerrará en 10 minutos.");
}, 50000);

console.log("Servidor WebSocket escuchando en ws://localhost:8080");
