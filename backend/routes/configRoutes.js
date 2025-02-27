const express = require("express");
const router = express.Router();
const { getAllConfigs, getConfigByKey, updateConfig } = require("../controllers/configController");

router.get("/", getAllConfigs);
router.get("/:key", getConfigByKey);
router.post("/update", updateConfig);

module.exports = router;
