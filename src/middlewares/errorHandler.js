export const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.message);

  const statusCode = err.statusCode || 500;
  const response = {
    status: 'error',
    message: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};