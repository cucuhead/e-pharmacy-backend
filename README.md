# E-Pharmacy — Backend API

RESTful API for the E-Pharmacy admin dashboard. Built with Express and MongoDB, it handles authentication, dashboard statistics, and CRUD for products, suppliers, orders, and customers.

## Live API

- **Base URL:** https://e-pharmacy-backend-a20z.onrender.com
- **Health check:** https://e-pharmacy-backend-a20z.onrender.com/api/health

> The API is hosted on Render's free tier. The first request after a period of inactivity may take 30–50 seconds while the service wakes up.

## Project Resources

- **Frontend repository:** https://github.com/cucuhead/e-pharmacy-frontend
- **Live app:** https://e-pharmacy-frontend-eight.vercel.app

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** MongoDB Atlas with Mongoose
- **Auth:** JWT (access + refresh tokens), bcrypt for password hashing
- **Security:** helmet, CORS

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB connection string (MongoDB Atlas recommended)

### Installation

```bash
git clone https://github.com/cucuhead/e-pharmacy-backend.git
cd e-pharmacy-backend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```dotenv
PORT=5000
NODE_ENV=development

JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

MONGODB_URI=your-mongodb-connection-string
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (local only — the host assigns its own in production) |
| `NODE_ENV` | `development` or `production` |
| `JWT_ACCESS_SECRET` | Secret used to sign short-lived access tokens |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime (e.g. `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (e.g. `7d`) |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `MONGODB_URI` | MongoDB Atlas connection string |

### Running

```bash
npm run dev     # development with auto-reload (nodemon)
npm start       # production
```

The server starts at `http://localhost:5000`.

## API Endpoints

All routes are prefixed with `/api`.

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/user/login` | Log in, returns access + refresh tokens | No |
| POST | `/user/refresh` | Exchange a refresh token for new tokens | No |
| GET | `/user/logout` | Log the current user out | Yes |
| GET | `/user/user-info` | Get the authenticated user's info | Yes |

### Dashboard

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/dashboard` | Statistics, recent customers, income/expenses | Yes |

### Products

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/products` | Paginated product list (supports name filter) | Yes |
| POST | `/products` | Create a product | Yes |
| PUT | `/products/:productId` | Update a product | Yes |
| DELETE | `/products/:productId` | Delete a product | Yes |

### Suppliers

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/suppliers` | Paginated supplier list (supports name filter) | Yes |
| POST | `/suppliers` | Create a supplier | Yes |
| PUT | `/suppliers/:supplierId` | Update a supplier | Yes |

### Orders

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/orders` | Paginated order list (supports name filter and sorting) | Yes |

### Customers

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/customers` | Paginated customer list (supports name filter) | Yes |
| GET | `/customers/:customerId` | Single customer details with order history | Yes |

### Utility

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/health` | Service health check | No |

## Authentication

The API uses a two-token JWT scheme. The access token is short-lived (15 minutes) and the refresh token is long-lived (7 days). Protected routes require an `Authorization: Bearer <accessToken>` header. When an access token expires, the client exchanges its refresh token at `/user/refresh` for a fresh pair.

## Error Handling

The API returns appropriate HTTP status codes (`200`, `400`, `401`, `403`, `404`, `500`) with descriptive JSON error messages. Incoming data is validated before being saved to the database.

## Project Status

This project was built as a 10-day capstone assignment and is now complete. The API covers all endpoints required by the technical specification and is deployed in production. Future improvements could include rate limiting, request logging, automated tests, and a refresh-token rotation strategy.

## Deployment

The API is deployed on **Render**. Build command: `npm install`. Start command: `node src/server.js`. Environment variables are configured in the Render dashboard. The MongoDB Atlas cluster allows connections from any IP so the host can reach it.