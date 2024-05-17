const { Wave } = require("../database/models/wave.model");

exports.getWaves = () => {
  return Wave.find({}).populate("author").exec();
};

exports.createWave = async wave => {
  const newWave = new Wave(wave);
  return newWave.save();
};

exports.deleteWave = async waveId => {
  return await Wave.findByIdAndDelete(waveId).exec();
};

exports.getWave = async waveId => {
  return await Wave.findOne({ _id: waveId }).populate("author").exec();
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

exports.getCurrentUserWavesWithFollowing = user => {
  return Wave.find({ author: { $in: [...user.following, user._id] } })
    .populate("author")
    .exec();
};

exports.getUserWavesFromAuthorId = authorId => {
  return Wave.find({ author: authorId }).populate("author").exec();
};
