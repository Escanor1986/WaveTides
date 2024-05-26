const express = require("express");
// const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();
const dotenv = require("dotenv");
const errorHandler = require("errorhandler");
const util = require("util");
const routing = require("./routes");
require("./database");

dotenv.config();

const app = express();
exports.app = app;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cookieParser());
require("./config/session.config");
require("./config/passport.config");

const helmetConfig = require("./config/helmet.config");
app.use(helmetConfig());

// app.use(morgan("short"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routing);

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.log(
      util.inspect(err, {
        compact: true,
        depth: 5,
        breakLength: 80,
        color: true,
      })
    );
    const code = err.code || 500;
    res.status(code).json({
      code: code,
      message: code === 500 ? null : err.message,
    });
  });
}

module.exports = app;
