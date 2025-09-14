import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import routes from "./routes";
import { apiLimiter } from "./middleware/rateLimiter";
import { ApiResponse } from "./types";

// Create Express app
const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Rate limiting (disabled in test environment)
if (process.env.NODE_ENV !== "test") {
  app.use(apiLimiter);
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use("/api", routes);

// Root endpoint
app.get("/", (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: "Persona.io API Server",
    data: {
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    },
  };
  res.status(200).json(response);
});

// 404 handler
app.use("*", (req, res) => {
  const response: ApiResponse = {
    success: false,
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  };
  res.status(404).json(response);
});

// Global error handler
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global error handler:", error);

    const response: ApiResponse = {
      success: false,
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    };

    res.status(error.status || 500).json(response);
  }
);

export default app;
