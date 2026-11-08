
const JournalEntry = require("../models/JournalEntry");

const createJournalEntry = async (req, res) => {
    try {
        const { description, debitAccount, creditAccount, amount } = req.body;

        if (!description || !debitAccount || !creditAccount || !amount || amount <= 0) {
            return res.status(400).json({
                message: "Please provide journal entry details"
            });
        }

        if (debitAccount === creditAccount) {
            return res.status(400).json({
                message: "Debit and credit accounts must be different"
            });
        }

        const entry = await JournalEntry.create({
            clinic: req.user.clinicId,
            description,
            debitAccount,
            creditAccount,
            amount
        });

        return res.status(201).json({
            message: "Journal entry created successfully",
            entry
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getJournalEntries = async (req, res) => {
    try {
        const entries = await JournalEntry.find({
            clinic: req.user.clinicId
        })
        .populate("debitAccount", "name accountCode")
        .populate("creditAccount", "name accountCode");

        return res.status(200).json({
            count: entries.length,
            entries
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createJournalEntry,
    getJournalEntries
};
