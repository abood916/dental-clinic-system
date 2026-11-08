
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "doctor", "receptionist"],
      default: "receptionist",
      required: true,
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

    isActive: {
      type: Boolean,
      default: true,
    },

  },
  
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
