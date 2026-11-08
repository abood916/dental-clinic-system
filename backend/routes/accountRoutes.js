
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    createAccount,
    getAccounts,
    updateAccount,
    deactivateAccount
} = require("../controller/accountController");

router.use(authMiddleware);

router.post("/", authorizeRoles("admin"), createAccount);


router.get("/", authorizeRoles("admin"), getAccounts);
router.put("/:id", authorizeRoles("admin"), updateAccount);
router.patch("/:id/deactivate", authorizeRoles("admin"), deactivateAccount);

module.exports = router;
