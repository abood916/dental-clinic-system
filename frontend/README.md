# Dental Clinic Frontend

This is the frontend for the Dental Clinic Management System. It is built with Next.js and provides the staff dashboard and clinic management UI used to interact with the backend API.

## Features

- Secure login and registration flow
- Dashboard overview for clinic activity
- Patient management screens
- Appointments and scheduling pages
- Invoices and payments
- Expenses and financial summaries
- HR and payroll views
- Accounting and journal entries

## Prerequisites

- Node.js 18+
- npm
- A running backend API on `http://localhost:4000`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm run start
```

## Notes

- If you are running the app against a different backend URL, update `NEXT_PUBLIC_API_URL` accordingly.
- The default frontend API configuration points to a hosted deployment, so local development should explicitly override it with the local backend URL.
