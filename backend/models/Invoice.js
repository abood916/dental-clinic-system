

const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
    {
        clinic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true,
        },

        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
        },

        invoiceNumber: {
            type: String,
            required: true,
            trim: true,
        }, 

        items: [
            {
                description: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                }
            }
        ],

        total: {
            type: Number,
            required: true,
            min: 0,
        },

        paidAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: ["unpaid", "partially_paid", "paid"],
            default: "unpaid",
        },
    },

    {
        timestamps: true,
    }
);

invoiceSchema.index(
    { clinic: 1, invoiceNumber: 1 },
    { unique: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;