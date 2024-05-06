const { Wave } = require("../database/models/wave.model");

exports.getWaves = () => {
  return Wave.find({}).exec();
};

exports.createWave = async wave => {
  const newWave = new Wave(wave);
  return newWave.save();
};

exports.deleteWave = async waveId => {
  return await Wave.findByIdAndDelete(waveId).exec();
};

exports.getWave = async waveId => {
  return await Wave.findOne({ _id: waveId }).exec();
};

exports.updateWave = async (waveId, wave) => {
  return await Wave.findByIdAndUpdate(
    waveId,
    {
      $set: wave,
    },
    { runValidators: true }
  );
};
