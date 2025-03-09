import "reflect-metadata";
import dotenv from "dotenv";
import { AppDataSource } from "./infrastructure/database/data-source";
import { createApp } from "./app";

// Load environment variables
dotenv.config();

// Get port from environment
const PORT = process.env.PORT || 3000;

// Initialize database connection and start server
const startServer = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log("Database connection established");

    // Create Express application
    const app = createApp();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
