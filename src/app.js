import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'E-Pharmacy API is running',
    timestamp: new Date().toISOString(),
  });
});

// TODO: Routes will be mounted here in Day 2-5
// app.use('/api/user', userRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/orders', ordersRoutes);
// app.use('/api/products', productsRoutes);
// app.use('/api/suppliers', suppliersRoutes);
// app.use('/api/customers', customersRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler (Day 2'de detaylandıracağız)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

export default app;