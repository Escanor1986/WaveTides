const router = require("express").Router();
const api = require("./api");
const Wave = require("../database/models/wave.model");

router.use("/api", api);

router.get("/wave/new", (req, res) => {
  res.render("waves/wave-form");
});

router.get("/", (req, res) => {
  Wave.find({})
    .exec()
    .then(waves => res.render("waves/wave-list", { waves }));
});

module.exports = router;
