const mongoose = require("mongoose");
const schema = mongoose.Schema;

const waveSchema = schema({
  content: {
    type: String,
    maxlength: [140, "Wave trop longue."],
    minlength: [1, "Wave trop courte."],
    required: [true, "Champs requis"],
  },
});

const Wave = mongoose.model("wave", waveSchema);

module.exports = { Wave };
