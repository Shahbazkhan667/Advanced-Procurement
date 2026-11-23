function notFound(_req, _res, next) { next(Object.assign(new Error('Route not found'), { status: 404 })); }
function errorHandler(err, _req, res, _next) {
  const status = err.status || (err.name === 'ValidationError' || err.name === 'ZodError' ? 400 : err.code === 11000 ? 409 : 500);
  if (status >= 500) console.error(err);
  const message = status >= 500 ? 'Internal server error' : (err.name === 'ZodError' ? 'Request validation failed' : err.message);
  res.status(status).json({ success: false, message });
}
module.exports = { notFound, errorHandler };
