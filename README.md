# E-Pharmacy Backend

E-Pharmacy Admin Dashboard backend API. Built with Express, MongoDB, and JWT.

## Stack

- Node.js + Express 5
- MongoDB + Mongoose
- JWT (access + refresh tokens)
- Joi validation
- bcryptjs password hashing

## Setup

\`\`\`bash
npm install
cp .env.example .env
# Fill in MONGODB_URI and JWT secrets
npm run dev
\`\`\`

Server runs on `http://localhost:5000`.

## Endpoints

See `docs/api.md` (coming in Day 6).