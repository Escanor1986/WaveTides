const router = require("express").Router();
const {
  waveList,
  waveNew,
  waveCreate,
} = require("../controllers/waves.controllers");

router.get("/", waveList);

router.get("/new", waveNew);

router.post("/", waveCreate);

module.exports = router;
