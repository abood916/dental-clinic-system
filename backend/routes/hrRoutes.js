
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    createEmployee,
    getEmployees,
    updateEmployee,
    createAttendance,
    getAttendance,
    createLeave,
    getLeaves,
    updateLeaveStatus,
    createPayroll,
    getPayrolls,
    getHRSummary
} = require("../controller/hrController");

router.use(authMiddleware);

router.post("/employees", authorizeRoles("admin"), createEmployee);
router.get("/employees", authorizeRoles("admin"), getEmployees);
router.put("/employees/:id", authorizeRoles("admin"), updateEmployee);

router.post("/attendance", authorizeRoles("admin"), createAttendance);
router.get("/attendance", authorizeRoles("admin"), getAttendance);

router.post("/leaves", authorizeRoles("admin"), createLeave);
router.get("/leaves", authorizeRoles("admin"), getLeaves);
router.patch("/leaves/:id", authorizeRoles("admin"), updateLeaveStatus);

router.post("/payroll", authorizeRoles("admin"), createPayroll);
router.get("/payroll", authorizeRoles("admin"), getPayrolls);

router.get("/summary", authorizeRoles("admin"), getHRSummary);

module.exports = router;
