
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const { getFinancialSummary } = require("../controller/financialController");

router.get("/summary",
    authMiddleware,
    authorizeRoles("admin"),
    getFinancialSummary
);

module.exports = router;
