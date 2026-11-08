
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    createJournalEntry,
    getJournalEntries,
} = require("../controller/journalEntryController");

router.use(authMiddleware);

router.post("/", authorizeRoles("admin"), createJournalEntry);
router.get("/", authorizeRoles("admin"), getJournalEntries);

module.exports = router;
