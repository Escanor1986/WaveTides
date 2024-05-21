const router = require("express").Router();
const { ensureAuthenticated } = require("../config/security.config");
const passport = require("passport");
const jwtToken = passport.authenticate("jwt", { session: false });
const waves = require("./waves.routes");
const users = require("./users.routes");
const auth = require("./auth.routes");

router.use("/waves", jwtToken, ensureAuthenticated, waves);
router.use("/users", users);
router.use("/auth", auth);

router.get("/", (req, res) => {
  res.redirect("/waves");
});

module.exports = router;
