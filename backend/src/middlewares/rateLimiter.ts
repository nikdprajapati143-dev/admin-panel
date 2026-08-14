import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 60, // Max 60 login attempts per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many login/password reset attempts. Please try again after 5 minutes.",
    },
});

export const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10000, // Max 10000 requests per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many requests from this IP, please try again after 5 minutes.",
    },
});
