const express = require('express');
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const {

    createPatient, getPatients,
    getPatientById, updatePatient,
    deletePatient

    }= require("../controller/patientController");

router.post("/", 
    authMiddleware,
    authorizeRoles("admin", "receptionist"),
    createPatient,
);

router.get("/", 
    authMiddleware,
    authorizeRoles("admin", "receptionist", "doctor"),
    getPatients,
);

router.get("/:id", 
    authMiddleware,
    authorizeRoles("admin", "receptionist", "doctor"),
    getPatientById,
);

router.put("/:id", 
    authMiddleware,
    authorizeRoles("admin", "receptionist"),
    updatePatient
);

router.delete("/:id", 
    authMiddleware,
    authorizeRoles("admin", "receptionist"),
    deletePatient
)

module.exports = router;