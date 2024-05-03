const mongoose = require("mongoose");

// Connection à MongoDB
mongoose
  .connect(
    "mongodb+srv://Escanor:JokasTb9SnWKPBDB@cluster0.lsuxpsu.mongodb.net/waver?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log(`Connection MongoDB ok !`);
  })
  .catch(Error => {
    console.log(Error);
  });
