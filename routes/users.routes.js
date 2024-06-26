const router = require("express").Router();
const { ensureAuthenticated } = require("../config/security.config");
const passport = require("passport");

const jwtToken = passport.authenticate("jwt", { session: false });
const { check } = require("express-validator");
const {
  signup,
  signupForm,
  uploadImage,
  userProfile,
  userList,
  followUser,
  unFollowUser,
} = require("../controllers/users.controllers");

router.get("/", [check("search").isAlphanumeric().trim().escape()], userList);
router.get("/follow/:userId", followUser);
router.get("/unfollow/:userId", unFollowUser);
router.get("/:username", userProfile);
router.get("/signup/form", signupForm);
router.post("/signup", signup);
router.post("/update/image", jwtToken, ensureAuthenticated, uploadImage);

module.exports = router;
