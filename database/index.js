require("dotenv").config();

const mongoose = require("mongoose");

// Connection à MongoDB en utilisant la variable d'environnement MONGODB_URL
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log(`Connection MongoDB ok !`);
  })
  .catch(error => {
    console.error(error);
  });
