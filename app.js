const express = require("express");
const morgan = require("morgan");
const path = require("path");
const helmet = require("helmet");
const dotenv = require("dotenv");
const routing = require("./routes");
require("./database");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://kit.fontawesome.com"],
        objectSrc: ["'none"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(morgan("short"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routing);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Une erreur est survenue !");
});

app.listen(port, () => {
  console.log(`Rendez-vous sur http://localhost:${port}`);
});
