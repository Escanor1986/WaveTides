const { getWaves, createWave } = require("../queries/waves.queries");
const { validateWave } = require("../database/models/wave.model");

exports.waveList = async (req, res, next) => {
  try {
    const waves = await getWaves();
    res.render("waves/wave-list", { waves });
  } catch (e) {
    next(e);
  }
};

exports.waveNew = (req, res, next) => {
  res.render("waves/wave-form");
};

exports.waveCreate = async (req, res, next) => {
  try {
    const { error } = validateWave(req.body);
    if (error) throw new Error(error.details[0].message);

    await createWave(req.body);
    res.redirect("/waves");
  } catch (err) {
    res.status(400).render("waves/wave-form", { errors: [err.message] });
  }
};
