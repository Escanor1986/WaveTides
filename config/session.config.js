const { app } = require("../app");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { clientPromise } = require("../database");
require("dotenv").config();

const secret = process.env.SESSION_SECRET;

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 14,
    },
    store: MongoStore.create({
      clientPromise: clientPromise.then(m => m.connection.getClient()),
      ttl: 60 * 60 * 24 * 14,
    }),
  })
);
