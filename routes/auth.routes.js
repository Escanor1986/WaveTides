const router = require("express").Router();
const {
  signinForm,
  signin,
  signout,
  googleAuth,
  googleAuthCb,
  facebookAuth,
  facebookAuthCb,
} = require("../controllers/auth.controllers");

router.get("/signin/form", signinForm);
router.post("/signin", signin);
router.get("/signout", signout);
router.get("/google", googleAuth);
router.get("/google/cb", googleAuthCb);
router.get("/facebook", facebookAuth);
router.get("/facebook/cb", facebookAuthCb);

module.exports = router;
