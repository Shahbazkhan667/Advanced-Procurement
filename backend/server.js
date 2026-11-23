 require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

function validateEnvironment() {
  const missing = ['MONGO_URI', 'JWT_SECRET', 'FRONTEND_URL'].filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
  if (!Number.isInteger(Number(process.env.PORT || 5000))) {
    throw new Error('PORT must be a valid integer');
  }
}

function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());

  const allowedOrigins = String(process.env.FRONTEND_URL)
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  app.use(express.json({ limit: '20kb' }));

  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 200,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
    })
  );

  app.use(
    '/api/auth/login',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
    })
  );

  app.get('/health', (_req, res) =>
    res.json({ success: true, message: 'ProCureX API is healthy', data: { status: 'ok' } })
  );

  app.use('/api/auth', authRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

async function start() {
  validateEnvironment();
  await connectDB(process.env.MONGO_URI);
  const port = Number(process.env.PORT || 5000);
  const server = createApp().listen(port, () =>
    console.log(`ProCureX API listening on port ${port}`)
  );

  const shutdown = async () => {
    server.close();
    const mongoose = require('mongoose');
    await mongoose.disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

if (require.main === module) {
  start().catch((error) => {
    console.error(`Startup failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { createApp, validateEnvironment };