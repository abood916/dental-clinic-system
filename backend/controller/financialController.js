
const Invoice = require("../models/Invoice");
const Payment = require("../models/payment");
const Expense = require("../models/Expense");

const getFinancialSummary = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;

        const invoices = await Invoice.find({ clinic: clinicId });
        const payments = await Payment.find({ clinic: clinicId });
        const expenses = await Expense.find({ clinic: clinicId });

        const totalInvoices = invoices.reduce((sum, item) => sum + item.total, 0);
        const totalPayments = payments.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

        return res.status(200).json({
            totalInvoices,
            totalPayments,
            totalExpenses,
            remainingAmount: totalInvoices - totalPayments,
            netProfit: totalPayments - totalExpenses
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { getFinancialSummary };
   