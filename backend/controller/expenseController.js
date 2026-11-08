
const Expense = require("../models/Expense");


const createExpense = async (req, res) => {
    try {
        const { description, amount, category, date } = req.body;

        const expense = await Expense.create({
            clinic: req.user.clinicId,
            description,
            amount,
            category,
            date
        });

        return res.status(201).json({
            message: "Expense created successfully",
            expense
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({
            clinic: req.user.clinicId
        }).sort({ date: -1 });

        return res.status(200).json({
            count: expenses.length,
            expenses
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            clinic: req.user.clinicId
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        return res.status(200).json({ expense });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            {
                _id: req.params.id,
                clinic: req.user.clinicId
            },
            req.body,
            { new: true, runValidators: true }
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            message: "Expense updated successfully",
            expense
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            clinic: req.user.clinicId
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
};
