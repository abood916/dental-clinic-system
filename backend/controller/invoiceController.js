
const Invoice = require("../models/Invoice");


const createInvoice = async (req, res) => {
    try {
        const { patient, appointment, invoiceNumber, items } = req.body;

        if (!patient || !invoiceNumber || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Please provide invoice details"
            });
        }

        const total = items.reduce((sum, item) => sum + item.price, 0);

        const invoice = await Invoice.create({
            clinic: req.user.clinicId,
            patient,
            appointment,
            invoiceNumber,
            items,
            total
        });

        return res.status(201).json({
            message: "Invoice created successfully",
            invoice
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({
            clinic: req.user.clinicId
        }).populate("patient", "fullName phone");

        return res.status(200).json({
            count: invoices.length,
            invoices
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({
            _id: req.params.id,
            clinic: req.user.clinicId
        }).populate("patient", "fullName phone");

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        return res.status(200).json({ invoice });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const updateInvoice = async (req, res) => {
    try {
        const { patient, appointment, invoiceNumber, items } = req.body;

        const total = items.reduce((sum, item) => sum + item.price, 0);

        const invoice = await Invoice.findOneAndUpdate(
            {
                _id: req.params.id,
                clinic: req.user.clinicId
            },
            {
                patient,
                appointment,
                invoiceNumber,
                items,
                total
            },
            { new: true, runValidators: true }
        );

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        return res.status(200).json({
            message: "Invoice updated successfully",
            invoice
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndDelete({
            _id: req.params.id,
            clinic: req.user.clinicId
        });

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        return res.status(200).json({
            message: "Invoice deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
};
