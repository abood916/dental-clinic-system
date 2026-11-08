
const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema({
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true
    },

    description: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    debitAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },

    creditAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0.01
    }
}, { timestamps: true });

module.exports = mongoose.model("JournalEntry", journalEntrySchema);
