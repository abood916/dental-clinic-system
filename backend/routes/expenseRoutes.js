const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
} = require("../controller/expenseController");


router.post("/", 
    authMiddleware,
    authorizeRoles("admin", "receptionist"),
    createExpense,
);


router.get("/",
    authMiddleware,
    authorizeRoles("receptionist", "admin"),
    getExpenses,
);


router.get("/:id",
    authMiddleware,
    authorizeRoles("receptionist", "admin"),
    getExpenseById
);


router.put("/:id",
    authMiddleware,
    authorizeRoles("receptionist", "admin"),
    updateExpense
);

router.delete("/:id", 
    authMiddleware,
    authorizeRoles("receptionist", "admin"),
    deleteExpense,
);

module.exports = router;