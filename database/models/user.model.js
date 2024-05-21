const mongoose = require("mongoose");
const schema = mongoose.Schema;
require("dotenv").config();
const bcrypt = require("bcrypt");

// Création de variable d'environnement pour augmenter la robustesse du hachage du password
const pepper = process.env.PEPPER_SECRET;
const uniqueSalt = process.env.UNIQUE_SALT;

const userSchema = schema({
  username: { type: String, required: true, unique: true },
  local: {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String },
    facebookId: { type: String },
  },
  avatar: { type: String, default: "/images/wave.png" },
  following: { type: [schema.Types.ObjectId], ref: "user" },
});

// Méthode statique pour hasher le mot de passe avec salt et pepper
userSchema.statics.hashPassword = async function (password) {
  try {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const pepperAndSaltPassword = uniqueSalt + password + pepper;
    const hashedPassword = await bcrypt.hash(pepperAndSaltPassword, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Error hashing password");
  }
};

// Méthode pour comparer le mot de passe entré avec le mot de passe stocké
userSchema.methods.comparePassword = async function (password) {
  try {
    const pepperAndSaltPassword = uniqueSalt + password + pepper;
    return await bcrypt.compare(pepperAndSaltPassword, this.local.password);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Error comparing password");
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;
