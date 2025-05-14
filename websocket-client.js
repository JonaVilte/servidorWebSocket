import WebSocket from "ws";
import readline from "readline";
import chalk from "chalk";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Conectar al servidor WebSocket
const socket = new WebSocket("ws://localhost:8080");

// Capturar eventos de conexión
socket.on("open", () => {
  rl.question("Bienvenido al chat. Por favor, ingresa tu nombre de usuario: ", (username) => {
    socket.send(username);
    console.log(chalk.green(`Conectado al chat como "${username}".`));
  });
});

// Escuchar los mensajes del servidor
socket.on("message", (message) => {
  console.log(chalk.blue(message.toString()));
});

// Capturar mensajes del usuario
rl.on("line", (input) => {
  socket.send(input);
});
