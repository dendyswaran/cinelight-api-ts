import dotenv from "dotenv";

dotenv.config();

// Application
export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = parseInt(process.env.PORT || "3000", 10);
export const API_PREFIX = process.env.API_PREFIX || "/api/v1";

// Database
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = parseInt(process.env.DB_PORT || "5432", 10);
export const DB_USERNAME = process.env.DB_USERNAME || "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
export const DB_DATABASE = process.env.DB_DATABASE || "cinelight_dev";

// JWT
export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// Logging
export const LOG_LEVEL = process.env.LOG_LEVEL || "debug";

// CORS
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
