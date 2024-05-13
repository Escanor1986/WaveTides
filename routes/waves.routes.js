const router = require("express").Router();
const {
  waveList,
  waveNew,
  waveCreate,
  waveDelete,
  waveEdit,
  waveUpdate,
} = require("../controllers/waves.controllers");
const { ensureAuthenticated } = require("../config/security.config");

router.get("/", ensureAuthenticated, waveList);
router.get("/new", waveNew);
router.post("/", waveCreate);
router.get("/edit/:waveId", waveEdit);
router.post("/update/:waveId", waveUpdate);
router.delete("/:waveId", waveDelete);

module.exports = router;
