
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    createPeriod,
    getPeriods,
    closePeriod
} = require("../controller/accountingPeriodController");

router.use(authMiddleware);

router.post("/", authorizeRoles("admin"), createPeriod);
router.get("/", authorizeRoles("admin"), getPeriods);
router.patch("/:id/close", authorizeRoles("admin"), closePeriod);

module.exports = router;
