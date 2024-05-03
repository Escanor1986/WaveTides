const { Wave, validateWave } = require("../database/models/wave.model");

exports.waveList = async (req, res, next) => {
  try {
    const waves = await Wave.find({}).exec();
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
    const { content } = req.body;

    // Valider les données d'entrée
    const { error } = validateWave(req.body);
    if (error) {
      return res
        .status(400)
        .render("waves/wave-form", { errors: [error.details[0].message] });
    }

    // Créer une nouvelle wave
    const newWave = new Wave({ content });
    await newWave.save();

    // Rediriger ou renvoyer une réponse réussie
    res.redirect("/");
  } catch (err) {
    const errors = Object.keys(err.errors).map(key => err.errors[key].message);
    res.status(400).render("waves/wave-form", { errors });
  }
};
