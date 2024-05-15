const mongoose = require("mongoose");
const schema = mongoose.Schema;
require("dotenv").config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = schema({
  username: { type: String, required: true, unique: true },
  local: {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String },
  },
  avatar: { type: String, default: "../../public/images/wave.png" }, // Photo de profil
});

userSchema.statics.hashPassword = async password => {
  try {
    const pepper = process.env.PEPPER_SECRET;
    const uniqueSalt = process.env.UNIQUE_SALT;
    const salt = await bcrypt.genSalt(12); // Maximum 30

    const saltedPassword = password + uniqueSalt + pepper;

    // Utilisation du module 'crypto' pour créer un MDP haché et salé
    const hashedSaltedPassword = crypto
      // Création d'un HMAC (Hash-based Message Authentication Code) en utilisant SHA-256 comme algorithme de hachage
      .createHmac("sha256", pepper) // 'pepper' est une clé secrète utilisée en plus du 'salt' pour renforcer la sécurité
      // Mise à jour du HMAC avec le mot de passe salé
      .update(saltedPassword) // 'saltedPassword' est le mot de passe de l'utilisateur combiné avec un sel unique
      // Conversion du résultat en une chaîne hexadécimale
      .digest("hex"); // Le hachage final est représenté en hexadécimal

    // Utilisez bcrypt pour hasher le résultat final
    return bcrypt.hash(hashedSaltedPassword, salt);
  } catch (e) {
    throw e;
  }
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.local.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
