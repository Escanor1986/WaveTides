const router = require("express").Router();
const {
  waveList,
  allWaves,
  waveNew,
  waveCreate,
  waveDelete,
  waveEdit,
  waveUpdate,
  waveLike,
  waveDislike,
} = require("../controllers/waves.controllers");
const passport = require("passport");
const jwtToken = passport.authenticate("jwt", { session: false });

router.get("/", waveList);
router.get("/all", jwtToken, allWaves); // Nouvelle route pour toutes les waves
router.get("/new", jwtToken, waveNew);
router.post("/", jwtToken, waveCreate);
router.get("/edit/:waveId", jwtToken, waveEdit);
router.post("/update/:waveId", jwtToken, waveUpdate);
router.delete("/:waveId", jwtToken, waveDelete);
router.post("/:waveId/like", jwtToken, waveLike);
router.post("/:waveId/dislike", jwtToken, waveDislike);

module.exports = router;
