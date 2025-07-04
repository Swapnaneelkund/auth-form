import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import mongodbConnect from "./config/Database-Connection.js";
import { ApiError } from "./utils/ApiError.js";
import authRoutes from './services/auth/routes/authRoutes.js';

dotenv.config();
const app = express();
// Only connect to MongoDB if a URI is provided
if (process.env.mongodbURI) {
  mongodbConnect();
} else {
  logger.warn("No MongoDB URI found in .env. Skipping database connection.");
}

const allowedOrigin = process.env.CORS_ORIGIN || "http://127.0.0.1:5500";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    optionsSuccessStatus: 200, 
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
logger.info("App initializing...");
app.use('/api/auth', authRoutes);

// Basic Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }
  // Generic error for unhandled exceptions
  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred.",
    errors: [],
  });
});

export { app };