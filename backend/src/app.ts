import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import routes from "./routes/index.js";

const app = express();

// Security headers with resource sharing enabled for uploads
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
);

// Dynamic CORS configuration allowing development origins and FRONTEND_URL
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl, postman)
            if (!origin) return callback(null, true);
            if (
                allowedOrigins.includes(origin) ||
                /^http:\/\/localhost:\d+$/.test(origin) ||
                /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
            ) {
                return callback(null, true);
            }
            return callback(new Error("CORS policy violation"), false);
        },
        credentials: true,
    }),
);

// Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Cookie parser
app.use(cookieParser());

// Serve static uploaded avatar images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health check endpoint
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running cleanly",
        timestamp: new Date().toISOString(),
    });
});

// Apply rate limiter and mount API v1 routes
app.use("/api/v1", apiLimiter, routes);

// 404 & Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;