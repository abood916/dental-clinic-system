
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true
    },

    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    fullName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        trim: true,
    },

    jobTitle: {
        type: String,
        required: true
    },

    salary: {
        type: Number,
        required: true,
        min: 0
    },

    hireDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
