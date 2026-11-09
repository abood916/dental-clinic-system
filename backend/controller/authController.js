
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Clinic = require('../models/Clinic');


const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Full name, email, and password are required",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }

        const normalizeEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizeEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }

        // Shared training clinic
        let clinic = await Clinic.findOne({
            email: "training@dental-clinic.local",
        });

        if (!clinic) {
            clinic = await Clinic.create({
                name: "Training Dental Clinic",
                email: "training@dental-clinic.local",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName: fullName.trim(),
            email: normalizeEmail,
            password: hashedPassword,
            role: "receptionist",
            clinic: clinic._id,
        });

        return res.status(201).json({
            message: "Account created successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Register error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};



const login = async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: "Email or password are required",
            });
        };

        const normalizeEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizeEmail,
        }).select("+password");

        if(!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        };

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        };

        if (!user.isActive) {
            return res.status(403).json({
            message: "Your account is inactive",
        });
    }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
                clinicId: user.clinic,
                branchId: user.branch,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        return res.status(200).json({
            message: "Login seccessful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            }
        });
    } catch(error) {
        console.error("Login error", error.message);
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

module.exports = { register, login};