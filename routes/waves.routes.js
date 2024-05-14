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
router.get("/new", ensureAuthenticated, waveNew);
router.post("/", ensureAuthenticated, waveCreate);
router.get("/edit/:waveId", ensureAuthenticated, waveEdit);
router.post("/update/:waveId", ensureAuthenticated, waveUpdate);
router.delete("/:waveId", ensureAuthenticated, waveDelete);

module.exports = router;
