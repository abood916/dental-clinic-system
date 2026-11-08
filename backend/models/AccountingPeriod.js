
const mongoose = require("mongoose");

const accountingPeriodSchema = new mongoose.Schema(
    {
        clinic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("AccountingPeriod", accountingPeriodSchema);
