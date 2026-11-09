

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require("../middleware/authorizeRoles");

const {register, login} = require('../controller/authController');

router.post("/register", register);
router.post('/login', login);

router.get("/me", authMiddleware, (req, res) => {
    return res.status(200).json({
        message: "Authentication successful",
        user: req.user,
    })
});

router.get(
    "/admin-test",
    authMiddleware,
    authorizeRoles("admin"),
    (req, res) => {
        return res.status(200).json({
            message: "Welcome Admin! You have permission",
            user: req.user,
        });
    }
);

module.exports = router;