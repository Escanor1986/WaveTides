require("dotenv").config();
const mongoose = require("mongoose");

// Connection à MongoDB en utilisant la variable d'environnement MONGODB_URL
exports.clientPromise = mongoose
  .connect(process.env.MONGODB_URL)
  .then(client => {
    console.log(`Connection MongoDB ok !`);
    return client;
  })
  .catch(error => {
    console.error(`Erreur de connexion à MongoDB : ${error.message}`);
    process.exit(1);
  });
