
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
} = require("../controller/invoiceController");


router.post("/",
    authMiddleware,
    authorizeRoles("receptionist", "admin"),
    createInvoice,
);

router.get("/",
    authMiddleware,
    authorizeRoles("receptionist", "admin", "doctor"),
    getInvoices,
);


router.get("/:id",
    authMiddleware,
    authorizeRoles("admin", "receptionist", "doctor"),
    getInvoiceById,
);


router.put("/:id", 
    authMiddleware,
    authorizeRoles("receptionist", "admin"),
    updateInvoice,
);


router.delete("/:id", 
    authMiddleware,
    authorizeRoles("admin", "receptionist"),
    deleteInvoice,
);

module.exports = router;