const mongoose = require("mongoose");
const Invoice = require("./Invoice");

const paymentSchema = new mongoose.Schema(
    {
        clinic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true,
        },
        
        invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01
        },

        method: {
            type: String,
            enum: ["cash", "card", "bank_transfer"],
            required: true,
        }
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Payment", paymentSchema);