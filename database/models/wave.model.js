const mongoose = require("mongoose");
const Joi = require("joi");
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

function validateWave(wave) {
  const schema = Joi.object({
    content: Joi.string().min(1).max(140).required(),
  });
  return schema.validate(wave);
}

module.exports = { Wave, validateWave };
