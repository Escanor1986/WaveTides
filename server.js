// const https = require("https");
// const fs = require("fs");
const http = require("http");
const app = require("./app");
const WebSocket = require("ws");

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

const errorHandler = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/* const server = https.createServer(
  {
    key: fs.readFileSync("./certs/server.key"),
    cert: fs.readFileSync("./certs/server.crt"),
  },
  app
); */

const server = http.createServer(app);

server.on("error", errorHandler);

const wss = new WebSocket.Server({
  server,
  backlog: 20, // spécifie la taille de la file d'attente de connexions en attente dans le serveur WebSocket (avant qu'il ne commence à rejeter les nouvelles connexions).
  clientTracking: true, // Activer le suivi du nombre de clients connectés (valeur par défaut)
  perMessageDeflate: {
    // Activer la compression des messages
    zlibDeflateOptions: {
      // Voir zlib library defaults.
      chunkSize: 1024, // taille max en bytes (octets) de chaque chunk (morceau de données) compressés
      memLevel: 7, // Spécifie le montant de mémoire allouée pour la compression
      level: 3, // Niveau de compression (compris entre 0 & 9)
    },
    // décompression
    zlibInflateOptions: {
      chunkSize: 10 * 1024, // taille max en bytes (octets) de chaque chunk (morceau de données) compressé
    },
    // Autres paramètres pour les performances
    clientNoContextTakeover: true, // Spécifie si le client autorisé à réutiliser le contexte de compression entre les messages
    serverNoContextTakeover: true, // Spécifie si le serveur autorisé à réutiliser le contexte de compression entre les messages
    serverMaxWindowBits: 10, // Spécifie la taille maximale de la fenêtre glissante utilisée pour la compression des messages côté serveur
    concurrencyLimit: 50, // spécifie le nombre maximum de connexions simultanées que le serveur peut gérer
    threshold: 1024, //spécifie la taille minimale en bytes (octets) des messages qui doivent être compressés.
  },
  // Empêcher les connexions non sécurisées
  verifyClient: (info, cb) => {
    if (info.req.headers["x-forwarded-proto"] !== "https") {
      return cb(false, 400, "WebSocket Secure connection required");
    }
    return cb(true);
  },
});

wss.on("connection", (ws, req) => {
  // Envoyer un message de bienvenue à chaque nouveau client
  ws.send("Welcome to the WebSocket server!");

  // Envoyer un message à tous les clients connectés
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("A new client has connected!");
    }
  });

  ws.on("message", message => {
    console.log(`Received message: ${message}`);

    // Envoyer le message reçu à tous les autres clients connectés
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    // Envoyer un message à tous les clients connectés
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send("A client has disconnected!");
      }
    });
  });
});

server.listen(port, () => {
  console.log(`WebSocket server listening on port ${port} !`);
});
