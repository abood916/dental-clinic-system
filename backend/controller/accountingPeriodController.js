
const AccountingPeriod = require("../models/AccountingPeriod");


const createPeriod = async (req, res) => {
    try {
        const { name, startDate, endDate } = req.body;

        if (!name || !startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                message: "Please provide valid period details"
            });
        }

        const period = await AccountingPeriod.create({
            clinic: req.user.clinicId,
            name,
            startDate,
            endDate
        });

        return res.status(201).json({
            message: "Accounting period created successfully",
            period
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const getPeriods = async (req, res) => {
    try {
        const periods = await AccountingPeriod.find({
            clinic: req.user.clinicId
        }).sort({ startDate: -1 });

        return res.status(200).json({
            count: periods.length,
            periods
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const closePeriod = async (req, res) => {
    try {
        const period = await AccountingPeriod.findOneAndUpdate(
            {
                _id: req.params.id,
                clinic: req.user.clinicId
            },
            { status: "closed" },
            { new: true }
        );

        if (!period) {
            return res.status(404).json({
                message: "Accounting period not found"
            });
        }

        return res.status(200).json({
            message: "Accounting period closed successfully",
            period
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPeriod,
    getPeriods,
    closePeriod
};
