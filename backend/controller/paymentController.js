
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");


const createPayment = async (req, res) => {
    try {
        const { invoiceId, amount, method } = req.body;

        const invoice = await Invoice.findOne({
            _id: invoiceId,
            clinic: req.user.clinicId
        });

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        const payment = await Payment.create({
            clinic: req.user.clinicId,
            invoice: invoiceId,
            amount,
            method
        });

        invoice.paidAmount += amount;

        if (invoice.paidAmount >= invoice.total) {
            invoice.status = "paid";
        } else {
            invoice.status = "partially_paid";
        }

        await invoice.save();

        return res.status(201).json({
            message: "Payment created successfully",
            payment
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find({
            clinic: req.user.clinicId
        }).populate("invoice");

        return res.status(200).json({
            count: payments.length,
            payments
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findOne({
            _id: req.params.id,
            clinic: req.user.clinicId
        }).populate("invoice");

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        return res.status(200).json({ payment });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findOneAndUpdate(
            {
                _id: req.params.id,
                clinic: req.user.clinicId
            },
            req.body,
            { new: true, runValidators: true }
        );

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            message: "Payment updated successfully",
            payment
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findOneAndDelete({
            _id: req.params.id,
            clinic: req.user.clinicId
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            message: "Payment deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment
};
