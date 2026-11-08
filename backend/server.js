require('dotenv').config()

const express = require('express');
const app = express();
app.use(express.json());

const authRoutes = require("./routes/authRoutes");

const cors = require('cors');
app.use(cors());

const errorMidileware = require('./middleware/errorMiddleware');
app.use(errorMidileware);

const patientRoutes = require("./routes/patientRoutes");
app.use("/api/patient", patientRoutes);

const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Dental Clinic API is running!",
        data: null, 
    })
});

app.use('/api/auth', authRoutes);


const appointmentRoutes = require("./routes/appointmentRoutes");
app.use("/api/appointments", appointmentRoutes);

const invoiceRoutes = require("./routes/invoiceRoutes");
app.use("/api/invoices", invoiceRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

const expenseRoutes = require("./routes/expenseRoutes");
app.use("/api/expenses", expenseRoutes);

const financialRoutes = require("./routes/financialRoutes");
app.use("/api/financial", financialRoutes);

const accountRoutes = require("./routes/accountRoutes");
app.use("/api/accounts", accountRoutes);

const journalEntryRoutes = require("./routes/journalEntryRoutes");
app.use("/api/journal-entries", journalEntryRoutes);


const accountingPeriodRoutes = require("./routes/accountingPeriodRoutes");
app.use("/api/accounting-periods", accountingPeriodRoutes);


const hrRoutes = require("./routes/hrRoutes");
app.use("/api/hr", hrRoutes);


app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));

 