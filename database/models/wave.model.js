const mongoose = require("mongoose");
// Data validator
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

module.exports = {
  Wave,
  validateWave: wave => {
    const schema = Joi.object({
      content: Joi.string().min(1).max(140).required().messages({
        "string.min": "Wave trop courte.",
        "string.max": "Wave trop longue.",
        "any.required": "Champs requis.",
      }),
    });

    return schema.validate(wave);
  },
};
