
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
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

    date: {
        type: Date,
        default: Date.now
    },

    checkIn: {
        type: Date,
    },

    checkOut: {
        type: Date
    },

    status: {
        type: String,
        enum: ["present", "absent", "late"],
        default: "present"
    }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
