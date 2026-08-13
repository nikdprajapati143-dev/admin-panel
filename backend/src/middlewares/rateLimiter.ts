import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // Limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many login/password reset attempts. Please try again after 15 minutes.",
    },
});

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many requests from this IP, please try again after 15 minutes.",
    },
});
