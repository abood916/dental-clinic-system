# Dental Clinic Management System

A full-stack web application for managing a dental clinic's daily operations, including patient records, appointments, billing, accounting, payroll, and staff administration.

This project contains:

- A Node.js + Express REST API backend
- A Next.js dashboard frontend for clinic staff and administrators
- MongoDB persistence for core business data
- JWT-based authentication for secure access

## Features

- User registration and login
- JWT authentication and role-based authorization
- Patient management
- Appointment scheduling and tracking
- Invoice and payment management
- Expense and accounting controls
- Financial summaries and journal entries
- Payroll, HR, attendance, and leave management
- Accounting period tracking
- Responsive dashboard UI for clinic operations

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT
- bcrypt
- CORS
- Dotenv

### Frontend
- Next.js
- React
- TypeScript
- ESLint

## Project Structure

```text
.
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── README.md
├── README.md
└── .git/
```

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Backend Setup

1. Open a terminal and navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `backend` folder with the following values:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/dental-clinic
JWT_SECRET=change-this-secret-key
```

4. Start the backend in development mode:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:4000
```

## Frontend Setup

1. Open a terminal and navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

4. Start the frontend development server:

```bash
npm run dev
```

The app will run at:

```text
http://localhost:3000
```

## Running Production Builds

### Frontend production build

```bash
cd frontend
npm run build
npm run start
```

### Backend production start

```bash
cd backend
npm start
```

## API Overview

The backend exposes REST APIs under the following base path:

```text
http://localhost:4000/api
```

Main routes include:

- `/api/auth` - registration and login
- `/api/patient` - patient management
- `/api/appointments` - appointment management
- `/api/invoices` - invoice management
- `/api/payments` - payment processing
- `/api/expenses` - expense tracking
- `/api/financial` - financial records
- `/api/accounts` - chart of accounts
- `/api/journal-entries` - accounting journal entries
- `/api/accounting-periods` - accounting periods
- `/api/hr` - HR-related endpoints

## Common Development Notes

- The frontend defaults to a remote API URL in `frontend/lib/api.ts`, but local development should override it with `NEXT_PUBLIC_API_URL`.
- The backend requires a valid MongoDB connection string in `MONGO_URI` or it will fail to start.
- The backend uses `JWT_SECRET` for signing authentication tokens.

## License

This project is currently unlicensed unless otherwise specified.
