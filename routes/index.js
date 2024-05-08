const router = require("express").Router();
const waves = require("./waves.routes");
const users = require("./users.routes");

router.use("/waves", waves);
router.use("/users", users);
router.get("/", (req, res) => {
  res.redirect("/waves");
});

module.exports = router;
