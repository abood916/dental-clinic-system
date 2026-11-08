
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
        clinic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true
        },

        accountCode: {
            type: String,
            required: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: ["asset", "liability", "equity", "revenue", "expense"],
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

accountSchema.index(
    { clinic: 1, accountCode: 1 },
    { unique: true }
);

module.exports = mongoose.model("Account", accountSchema);
