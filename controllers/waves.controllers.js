const {
  getWave,
  getWaves,
  createWave,
  deleteWave,
  updateWave,
} = require("../queries/waves.queries");

exports.waveList = async (req, res, next) => {
  try {
    const waves = await getWaves();
    res.render("waves/wave", { waves });
  } catch (e) {
    next(e);
  }
};

exports.waveNew = (req, res, next) => {
  res.render("waves/wave-form", { wave: {} });
};

exports.waveCreate = async (req, res, next) => {
  try {
    await createWave(req.body);
    res.redirect("/waves");
  } catch (e) {
    const errors = Object.keys(e.errors).map(key => e.errors[key].message);
    res.status(400).render("waves/wave-form", { errors });
  }
};

exports.waveDelete = async (req, res, next) => {
  try {
    const waveId = req.params.waveId;
    await deleteWave(waveId);
    const waves = await getWaves();
    res.render("waves/wave-list", { waves });
  } catch (e) {
    next(e);
  }
};

exports.waveEdit = async (req, res, next) => {
  try {
    const waveId = req.params.waveId;
    const wave = await getWave(waveId);
    res.render("waves/wave-form", { wave });
  } catch (e) {
    next(e);
  }
};

exports.waveUpdate = async (req, res, next) => {
  const waveId = req.params.waveId;

  try {
    const body = req.body;
    await updateWave(waveId, body);
    res.redirect("/waves");
  } catch (e) {
    const errors = Object.keys(e.errors).map(key => e.errors[key].message);
    const wave = await getWave(waveId);
    res.status(400);
    res.status(400).render("waves/wave-form", { errors, wave });
  }
};
