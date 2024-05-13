const mongoose = require("mongoose");
const schema = mongoose.Schema;
require("dotenv").config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = schema({
  username: { type: String, required: true },
  local: {
    email: { type: String, required: true },
    password: { type: String, required: true },
    googleId: { type: String },
  },
});

userSchema.statics.hashPassword = async password => {
  try {
    const pepper = process.env.PEPPER_SECRET;
    const uniqueSalt = process.env.UNIQUE_SALT;
    const salt = await bcrypt.genSalt(12); // Maximum 30

    const saltedPassword = password + uniqueSalt + pepper;

    const hashedSaltedPassword = crypto
      .createHmac("sha256", pepper)
      .update(saltedPassword)
      .digest("hex");

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
