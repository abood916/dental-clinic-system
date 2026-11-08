
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      // type: mongoose.Schema.Types.ObjectId, LATER
      // ref: "Patient",
      type: String,
      // required: true,
    },

    doctor: {
      // type: mongoose.Schema.Types.ObjectId, LATER
      // ref: "Doctor",
      type: String,
      // required: true,
    },

    clinic: {
      // type: mongoose.Schema.Types.ObjectId, LATER
      // ref: "Clinic",
      // required: true,
    },

    branch: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Branch",
      type: String,
      // required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      default: 30,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "confirmed", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

module.exports = Appointment;
