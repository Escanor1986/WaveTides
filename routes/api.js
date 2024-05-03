const router = require("express").Router();
const waves = require("./api.waves");

router.use("/waves", waves);

module.exports = router;
