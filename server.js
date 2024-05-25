const http = require("http");
const app = require("./app");

// Normalisation du port
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Gestion des erreurs
const errorHandler = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind =
    typeof port === "string" ? "Pipe " + port : "Port " + port;

  // Gestion des erreurs spécifiques
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur HTTP
const server = http.createServer(app);

// Écoute sur le port spécifié
server.listen(port);
server.on("error", errorHandler);
server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Server listening on " + bind);
});
