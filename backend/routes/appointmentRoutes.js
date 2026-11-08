const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    createAppointment,
    updateAppointment,
    getAppointments,
    getAppointmentById,
    cancelAppointment,
    updateAppointmentStatus
} = require("../controller/appointmentController");


router.post("/",
    authMiddleware,
    authorizeRoles("admin", "receptionist"),
    createAppointment,
);

router.put("/:id", 
    authMiddleware,
    authorizeRoles("admin", "receptionist"),
    updateAppointment,
);

router.get("/", 
    authMiddleware,
    authorizeRoles("admin", "receptionist", "doctor"),
    getAppointments
);

router.get("/:id", 
    authMiddleware,
    authorizeRoles("admin", "receptionist", "doctor"),
    getAppointmentById,
);

router.patch("/:id", 
    authMiddleware,
    authorizeRoles("admin", "receptionist"),
    cancelAppointment,
);


router.patch(
    "/:id/status",
    authMiddleware,
    authorizeRoles("admin", "receptionist", "doctor"),
    updateAppointmentStatus
);

module.exports = router;