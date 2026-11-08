const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        }, 
        
        phone: {
            type: String,
            trim: true,
            required: true,
        },

        email: {
            type: String,
            lowercase: true,
            trim: true,
        },

        dateOfBirth: {
            type: Date,
        },

        clinic: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Clinic",
                required: true,
            },

        gender : {
            type: String,
            enum: ["male", "female"],
        },

        address: {
            type: String,
            trim: true,
        },

        isActive: {
        type: Boolean,
        default: true,
        },
    },

    {
        timestamps: true,
    }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;