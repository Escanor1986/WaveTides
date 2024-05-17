const mongoose = require("mongoose");
const schema = mongoose.Schema;
require("dotenv").config();
const bcrypt = require("bcrypt");

const userSchema = schema({
  username: { type: String, required: true, unique: true },
  local: {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String },
    facebookId: { type: String },
  },
  avatar: { type: String, default: "/images/wave.png" }, // Photo de profil
  following: { type: [schema.Types.ObjectId], ref: "user" },
});

userSchema.statics.hashPassword = password => {
  return bcrypt.hash(password, 12);
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.local.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
