const express = require("express");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();
const helmet = require("helmet");
const dotenv = require("dotenv");
const errorHandler = require("errorhandler");
const routing = require("./routes");
require("./database");

dotenv.config();

const app = express();
exports.app = app;

const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

require("./config/session.config");
require("./config/passport.config");

// https://node-js.fr/security/helmet.html
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://unpkg.com/ https://kit.fontawesome.com/"
  );
  next();
});

app.use(morgan("short"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routing);

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    const code = err.code || 500;
    res.status(code).json({
      code: code,
      message: code === 500 ? null : err.message,
    });
  });
}

app.listen(port, () => {
  console.log(`Rendez-vous sur http://localhost:${port}`);
});
