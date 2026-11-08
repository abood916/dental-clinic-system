const errorMidileware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: "Internal server error",
    });
};

module.exports = errorMidileware;