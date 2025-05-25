// server.js
import { WebSocketServer } from "ws";
import chalk from "chalk";
import readline from "readline";

const server = new WebSocketServer({ port: 8080, host: "0.0.0.0" });

let clients = [];

server.on("connection", (socket) => {
  let username = null;

  socket.send("Bienvenido al chat. Por favor, ingresa tu nombre de usuario:");

  socket.on("message", (message) => {
    if (!username) {
      username = message.toString();
      clients.push({ username, socket });
      broadcastServerMessage(`El usuario "${username}" se ha unido al chat.`);
    } else {
      const fullMessage = `${username}: ${message}`;
      console.log(chalk.cyan(fullMessage)); // Mostrar mensaje del usuario en el servidor
      broadcast(fullMessage);
    }
  });

  socket.on("close", () => {
    clients = clients.filter(client => client.socket !== socket);
    if (username) {
      broadcastServerMessage(`El usuario "${username}" ha salido del chat.`);
    }
  });
});

function broadcast(message) {
  clients.forEach(client => {
    client.socket.send(message);
  });
}

function broadcastServerMessage(text) {
  const formatted = "[ADMIN]: " + text;
  console.log(chalk.green(formatted)); // Mostrar mensaje ADMIN en servidor
  clients.forEach(client => {
    client.socket.send(JSON.stringify({ from: "admin", text }));
  });
}

// Terminal para enviar mensajes como ADMIN
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Servidor WebSocket escuchando en ws://localhost:8080");
console.log("Escribe un mensaje como ADMIN para enviarlo a todos:");

rl.on("line", (input) => {
  if (input.trim() !== "") {
    broadcastServerMessage(input);
  }
});
