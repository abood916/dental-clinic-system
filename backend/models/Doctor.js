const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        }, 

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        }, 

        specialization: {
            type: String,
            required: true,
        },

        licenseNumber: {
            type: String,
        },

        yearsOfExperience: {
            type: Number,
        },

        clinic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true,
        },

        branch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            default: null,
        },

        isAvailable: {
            type: Boolean,
            default: true,
        }, 
    },

    {
        timestamps: true,
    }
)

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;