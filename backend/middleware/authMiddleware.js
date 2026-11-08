
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Clinic = require("../models/Clinic");
const Branch = require("../models/Branch");

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access denied. Token is required",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId)
            .select("fullName email role clinic branch isActive");

        if (!user || !user.isActive) {
            return res.status(401).json({
                message: "User not found or account is inactive",
            });
        }

        const clinic = await Clinic.findById(user.clinic);

        if (!clinic || !clinic.isActive) {
            return res.status(403).json({
                message: "Clinic is unavailable",
            });
        }

        let branch = null;

        if (user.branch) {
            branch = await Branch.findById(user.branch);

            if (
                !branch ||
                !branch.isActive ||
                branch.clinic.toString() !== clinic._id.toString()
            ) {
                return res.status(403).json({
                    message: "Invalid or inactive branch",
                });
            }
        }

        req.user = {
            userId: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            clinicId: clinic._id.toString(),
            branchId: branch ? branch._id.toString() : null,
        };

        next();

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = authMiddleware;
