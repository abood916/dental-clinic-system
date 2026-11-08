const Patient = require("../models/Patient");

const createPatient = async (req, res) => {
    try {
        const {fullName, email, phone, dateOfBirth, gender, address} = req.body;

        if(!fullName || !fullName.trim() || !phone || !phone.trim()) {
            return res.status(400).json({
                message: "Patient name and phone are required",   
            });
        };

        const patient = await Patient.create({
            fullName: fullName.trim(),
            phone: phone.trim(),
            email: email ? email.trim() : "Undefined",
            dateOfBirth: dateOfBirth,
            gender: gender,
            address: address,
            clinic: req.user.clinicId
        });

        return res.status(201).json({
            message: "Patient created successfully",
            data:  patient,
        });
    } catch(error) {
        return res.status(500).json({
            message: error.message,
        });
    };
};


const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find({ isActive: true }).sort({createdAt: -1});

        return res.status(200).json({
            data: patients,
        });
    } catch(error) {
        return res.status(500).json({
            message: error.message     
        })
    }
};

const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findOne({
        _id: req.params.id,
        clinic: req.user.clinicId,
        isActive: true,
        });

        if(!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        };

        return res.status(200).json({
            data: patient,
        });
    } catch(error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    };
};


const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findOneAndUpdate(
            {
                _id: req.params.id,
                clinic: req.user.clinicId,
                isActive: true,
            }, 

            {
                fullName: req.body.fullName,
                phone: req.body.phone,
                email: req.body.email,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                address: req.body.address,
            },

            {
                new: true,
                runValidators: true
            }
        );

        if(!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        };

        return res.status(200).json({
            message: "Updated successfully",
            data: patient,
        });
    } catch(error) {
        return res.status(500).json({
            message: "Internal server error",
        })
    }
};

const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findOneAndUpdate(
            {
                _id: req.params.id,
                clinic: req.user.clinicId,
                isActive: true,
            },

            {
                isActive: false,
            },

            {
                new: true,
            }
        );

        if(!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        };

        return res.status(200).json({
            message: "Patient deleted successfully"
        });
    } catch(error) {
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

module.exports = {
    createPatient, getPatients,
    getPatientById, updatePatient,
    deletePatient
}; 