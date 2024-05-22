const mongoose = require("mongoose");
const schema = mongoose.Schema;
require("dotenv").config();
const argon2 = require("argon2");

const pepper = process.env.PEPPER_SECRET;
const uniqueSalt = process.env.UNIQUE_SALT;

const userSchema = schema(
  {
    username: { type: String, required: true, unique: true },
    local: {
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      googleId: { type: String },
      facebookId: { type: String },
    },
    avatar: { type: String, default: "/images/wave.png" },
    following: { type: [schema.Types.ObjectId], ref: "user" },
  },
  {
    timestamps: true,
  }
);

// Méthode statique pour hasher le mot de passe avec Argon2, un unique salt et un pepper
userSchema.statics.hashPassword = async function (password) {
  try {
    const pepperAndSaltPassword = uniqueSalt + password + pepper;
    // le salt est généré automatiquement par argon2 (contrairement à bcrypt)
    const hashedPassword = await argon2.hash(pepperAndSaltPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 4,
      parallelism: 2,
    });
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
    return await argon2.verify(this.local.password, pepperAndSaltPassword);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Error comparing password");
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;
