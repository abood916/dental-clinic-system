
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Payroll = require("../models/Payroll");

// Create Employee
const createEmployee = async (req, res) => {
    try {
        const { user, fullName, phone, jobTitle, salary } = req.body;

        const employee = await Employee.create({
            clinic: req.user.clinicId,
            user,
            fullName,
            phone,
            jobTitle,
            salary
        });

        return res.status(201).json({
            message: "Employee created successfully",
            employee
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get Employees
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({
            clinic: req.user.clinicId
        }).populate("user", "fullName email role");

        return res.status(200).json({
            count: employees.length,
            employees
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOneAndUpdate(
            {
                _id: req.params.id,
                clinic: req.user.clinicId
            },
            req.body,
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            message: "Employee updated successfully",
            employee
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createAttendance = async (req, res) => {
    try {
        const { employee, checkIn, checkOut, status } = req.body;

        const employeeExists = await Employee.findOne({
            _id: employee,
            clinic: req.user.clinicId
        });

        if (!employeeExists) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const attendance = await Attendance.create({
            clinic: req.user.clinicId,
            employee,
            checkIn,
            checkOut,
            status
        });

        return res.status(201).json({
            message: "Attendance recorded successfully",
            attendance
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({
            clinic: req.user.clinicId
        }).populate("employee", "fullName jobTitle");

        return res.status(200).json({
            count: attendance.length,
            attendance
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createLeave = async (req, res) => {
    try {
        const { employee, startDate, endDate, reason } = req.body;

        const employeeExists = await Employee.findOne({
            _id: employee,
            clinic: req.user.clinicId
        });

        if (!employeeExists) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const leave = await Leave.create({
            clinic: req.user.clinicId,
            employee,
            startDate,
            endDate,
            reason
        });

        return res.status(201).json({
            message: "Leave request created successfully",
            leave
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({
            clinic: req.user.clinicId
        }).populate("employee", "fullName jobTitle");

        return res.status(200).json({
            count: leaves.length,
            leaves
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateLeaveStatus = async (req, res) => {
    try {
        const leave = await Leave.findOneAndUpdate(
            {
                _id: req.params.id,
                clinic: req.user.clinicId
            },
            { status: req.body.status },
            { new: true, runValidators: true }
        );

        if (!leave) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        return res.status(200).json({
            message: "Leave status updated successfully",
            leave
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createPayroll = async (req, res) => {
    try {
        const {
            employee,
            month,
            year,
            commission,
            incentives,
            deductions
        } = req.body;
 
        const employeeData = await Employee.findOne({
            _id: employee,
            clinic: req.user.clinicId
        });

        if (!employeeData) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const basicSalary = employeeData.salary;
        const totalCommission = commission || 0;
        const totalIncentives = incentives || 0;
        const totalDeductions = deductions || 0;

        const netSalary =
            basicSalary + totalCommission + totalIncentives - totalDeductions;

        const payroll = await Payroll.create({
            clinic: req.user.clinicId,
            employee,
            month,
            year,
            basicSalary,
            commission: totalCommission,
            incentives: totalIncentives,
            deductions: totalDeductions,
            netSalary
        });

        return res.status(201).json({
            message: "Payroll created successfully",
            payroll
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getPayrolls = async (req, res) => {
    try {
        const payrolls = await Payroll.find({
            clinic: req.user.clinicId
        }).populate("employee", "fullName jobTitle");

        return res.status(200).json({
            count: payrolls.length,
            payrolls
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getHRSummary = async (req, res) => {
    try {
        const employees = await Employee.find({
            clinic: req.user.clinicId
        });

        const payrolls = await Payroll.find({
            clinic: req.user.clinicId
        });

        const totalPayroll = payrolls.reduce(
            (sum, item) => sum + item.netSalary,
            0
        );

        return res.status(200).json({
            totalEmployees: employees.length,
            activeEmployees: employees.filter(
                item => item.status === "active"
            ).length,
            totalPayroll
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};
