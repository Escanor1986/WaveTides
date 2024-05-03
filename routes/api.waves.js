const router = require("express").Router();
const Wave = require("../database/models/wave.model");

router.post("/", (req, res) => {
  const body = req.body;
  const newWave = new Wave(body);
  newWave
    .save()
    .then(newTweet => res.redirect("/"))
    .catch(err => {
      const errors = Object.keys(err.errors).map(
        key => err.errors[key].message
      );
      res.status(400).render("waves/wave-form", { errors });
    });
});

module.exports = router;
