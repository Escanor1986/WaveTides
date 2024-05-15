const router = require("express").Router();
const { ensureAuthenticated } = require("../config/security.config");
const {
  signup,
  signupForm,
  uploadImage,
} = require("../controllers/users.controllers");

router.get("/signup/form", signupForm);
router.post("/signup", signup);
router.post("/update/image", ensureAuthenticated, uploadImage);

module.exports = router;
