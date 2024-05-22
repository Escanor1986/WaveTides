const mongoose = require("mongoose");
const schema = mongoose.Schema;

const waveSchema = schema(
  {
    content: {
      type: String,
      maxlength: [140, "Wave trop longue."],
      minlength: [1, "Wave trop courte."],
      required: [true, "Champs requis"],
    },
    author: { type: schema.Types.ObjectId, ref: "user", required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String], default: [] },
    usersDisliked: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const Wave = mongoose.model("wave", waveSchema);

module.exports = { Wave };
