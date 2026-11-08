
const Account = require("../models/Account");


const createAccount = async (req, res) => {
    try {
        const { accountCode, name, type } = req.body;

        const account = await Account.create({
            clinic: req.user.clinicId,
            accountCode,
            name,
            type
        });

        return res.status(201).json({
            message: "Account created successfully",
            account
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({
            clinic: req.user.clinicId
        }).sort({ accountCode: 1 });

        return res.status(200).json({
            count: accounts.length,
            accounts
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const updateAccount = async (req, res) => {
    try {
        const { accountCode, name, type } = req.body;

        const account = await Account.findOneAndUpdate(
            {
                _id: req.params.id,
                clinic: req.user.clinicId
            },
            { accountCode, name, type },
            { new: true, runValidators: true }
        );

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        return res.status(200).json({
            message: "Account updated successfully",
            account
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const deactivateAccount = async (req, res) => {
    try {
        const account = await Account.findOneAndUpdate(
            {
                _id: req.params.id,
                clinic: req.user.clinicId
            },
            { isActive: false },
            { new: true }
        );

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        return res.status(200).json({
            message: "Account deactivated successfully",
            account
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAccount,
    getAccounts,
    updateAccount,
    deactivateAccount
};
