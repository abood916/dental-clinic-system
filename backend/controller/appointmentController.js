const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Clinic = require("../models/Clinic");
const Branch = require("../models/Branch");
const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) => {
    try {
        const {
            patientId,
            doctorId,
            branchId,
            appointmentDate,
            reason,
            notes,
        } = req.body;

        if(!patientId || !appointmentDate || !reason) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        };

        const appointment = await Appointment.create({
            patient: patientId, 
            doctor: doctorId || "Default Doctor",
            clinic: req.user ? req.user.clinicId : patientId,
            branch: branchId || "Default Branch",
            appointmentDate,
            reason,
            notes,
        });

        return res.status(201).json({
            success: true,
            message: "Appointment created successfully",
            data: appointment,
        });
    } catch(error) {
        console.log("Error:", error.message);
        return res.status(500).json({
            message: error.message,
        });
    }
};


const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            clinic: req.user.clinicId,
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found",
            });
        }

        if (
            appointment.status === "completed" ||
            appointment.status === "cancelled"
        ) {
            return res.status(400).json({
                message: "This appointment cannot be updated",
            });
        }

        const patientId = req.body.patientId;
        const doctorId = req.body.doctorId;
        const branchId = req.body.branchId;

        const patient = await Patient.findOne({
            _id: patientId,
            clinic: req.user.clinicId,
            isActive: true,
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        }

        const doctor = await Doctor.findOne({
            _id: doctorId,
            clinic: req.user.clinicId,
            isAvailable: true,
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found or unavailable",
            });
        }

        const branch = await Branch.findOne({
            _id: branchId,
            clinic: req.user.clinicId,
            isActive: true,
        });

        if (!branch) {
            return res.status(404).json({
                message: "Branch not found",
            });
        }

        if (
            doctor.branch &&
            doctor.branch.toString() !== branchId.toString()
        ) {
            return res.status(400).json({
                message: "Doctor does not work in this branch",
            });
        }

        appointment.patient = patientId;
        appointment.doctor = doctorId;
        appointment.branch = branchId;

        if (req.body.appointmentDate !== undefined) {
            appointment.appointmentDate = req.body.appointmentDate;
        }

        if (req.body.duration !== undefined) {
            appointment.duration = req.body.duration;
        }

        if (req.body.reason !== undefined) {
            appointment.reason = req.body.reason;
        }

        if (req.body.notes !== undefined) {
            appointment.notes = req.body.notes;
        }

        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Appointment updated successfully",
            data: appointment,
        });

    } catch (error) {
        
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: req.params.id,
                clinic: req.user.clinicId,
                status: { $nin: ["completed", "cancelled"] },
            },
            {
                status: "cancelled",
            },
            {
                new: true,
            }
        );

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found or cannot be cancelled",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
            data: appointment,
        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            clinic: req.user.clinicId,
        })
            .populate("patient", "fullName phone")
            .populate("doctor", "fullName specialization")
            .populate("branch", "name")
            .sort({ appointmentDate: 1 });

        return res.status(200).json({
            success: true,
            data: appointments,
        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};



const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            clinic: req.user.clinicId,
        })
            .populate("patient", "fullName phone")
            .populate("doctor", "fullName specialization")
            .populate("branch", "name");

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: appointment,
        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};



const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "scheduled",
            "confirmed",
            "completed",
            "no-show",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid appointment status",
            });
        }

        const appointment = await Appointment.findOne({
            _id: req.params.id,
            clinic: req.user.clinicId,
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found",
            });
        }

        if (
            appointment.status === "completed" ||
            appointment.status === "cancelled"
        ) {
            return res.status(400).json({
                message: "Appointment status cannot be changed",
            });
        }

        appointment.status = status;

        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Appointment status updated successfully",
            data: appointment,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = {
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointmentStatus,
}