const router = require("express").Router();
const waves = require("./waves.routes");
const users = require("./users.routes");
const auth = require("./auth.routes");

router.use("/waves", waves);
router.use("/users", users);
router.use("/auth", auth);
router.get("/", (req, res) => {
  res.redirect("/waves");
});

module.exports = router;
