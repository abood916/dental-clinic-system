const express = require("express");
const router = express.Router();

const {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment
} = require("../controller/paymentController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/", 
    authMiddleware,
    authorizeRoles("receptionist", "admin"),
    createPayment,
);


router.get("/", 
    authMiddleware,
    authorizeRoles("receptionist", "admin"),
    getPayments,
);



router.get("/:id", 
    authMiddleware,
    authorizeRoles("receptionist", "admin"),
    getPaymentById,
);



router.put("/:id", 
    authMiddleware,
    authorizeRoles("receptionist", "admin"),
    updatePayment,
);


router.post("/:id", 
    authMiddleware,
    authorizeRoles("receptionist", "admin"),
    deletePayment,
);

module.exports = router;