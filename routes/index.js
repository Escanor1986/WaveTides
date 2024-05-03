const router = require("express").Router();
const waves = require("./waves");

router.use("/waves", waves);
router.get("/", (req, res) => {
  res.redirect("/waves");
});

module.exports = router;
