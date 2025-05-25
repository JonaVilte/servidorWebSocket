// client.js
import WebSocket from "ws";
import readline from "readline";
import chalk from "chalk";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// CAMBIA la IP si estás en otro dispositivo (ej. ws://192.168.1.100:8080)
const socket = new WebSocket("ws://localhost:8080");

socket.on("open", () => {
  rl.question("Bienvenido al chat. Por favor, ingresa tu nombre de usuario: ", (username) => {
    socket.send(username);
    console.log(chalk.green(`Conectado al chat como "${username}".`));
  });
});

socket.on("message", (data) => {
  try {
    const parsed = JSON.parse(data.toString());
    if (parsed.from === "admin") {
      console.log(chalk.yellow(`[ADMIN]: ${parsed.text}`));
    } else {
      console.log(chalk.blue(data.toString()));
    }
  } catch {
    // Mensajes normales (no JSON)
    console.log(chalk.blue(data.toString()));
  }
});

rl.on("line", (input) => {
  socket.send(input);
});
