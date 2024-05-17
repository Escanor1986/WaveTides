const router = require("express").Router();
const {
  waveList,
  allWaves,
  waveNew,
  waveCreate,
  waveDelete,
  waveEdit,
  waveUpdate,
} = require("../controllers/waves.controllers");

router.get("/", waveList);
router.get("/all", allWaves); // Nouvelle route pour toutes les waves
router.get("/new", waveNew);
router.post("/", waveCreate);
router.get("/edit/:waveId", waveEdit);
router.post("/update/:waveId", waveUpdate);
router.delete("/:waveId", waveDelete);

module.exports = router;
