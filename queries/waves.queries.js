const { Wave, validateWave } = require("../database/models/wave.model");

exports.getWaves = () => {
  return Wave.find({}).exec();
};

exports.createWave = async wave => {
  const { error } = validateWave(wave);
  if (error) throw new Error(error.details[0].message);

  const newWave = new Wave(wave);
  return newWave.save();
};
