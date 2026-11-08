
const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true
    },

    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
    },

    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },

    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },

    year: {
        type: Number,
        required: true
    },

    basicSalary: {
        type: Number,
        required: true
    },

    commission: {
        type: Number,
        default: 0
    },

    incentives: {
        type: Number,
        default: 0
    },

    deductions: {
        type: Number,
        default: 0
    },

    netSalary: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Payroll", payrollSchema);
