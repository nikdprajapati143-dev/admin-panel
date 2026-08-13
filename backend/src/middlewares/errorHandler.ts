import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import { logError } from "../utils/logger.js";

interface MongoError extends Error {
    code?: number;
    keyValue?: Record<string, unknown>;
}

export const errorHandler: ErrorRequestHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors: unknown = undefined;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    } else if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation Error";
        errors = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }));
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid Resource ID";
    } else if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    } else if ((err as MongoError).code === 11000) {
        statusCode = 409;
        const mongoErr = err as MongoError;
        const field = mongoErr.keyValue ? Object.keys(mongoErr.keyValue)[0] : "field";
        message = `Duplicate value entered for ${field}. Must be unique.`;
    } else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token. Please log in again.";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Your token has expired. Please log in again.";
    } else {
        message = err.message || "Internal Server Error";
    }

    // Always log error to backend/logs/error.log
    logError(`[API ERROR] ${req.method} ${req.originalUrl}`, {
        statusCode,
        message,
        errors,
        stack: env.NODE_ENV === "development" ? err.stack : undefined,
    });

    const response: Record<string, unknown> = {
        success: false,
        statusCode,
        message,
    };

    if (errors !== undefined) {
        response.errors = errors;
    }

    res.status(statusCode).json(response);
};

export const notFoundHandler = (
    req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    const error = new AppError(`Cannot find ${req.originalUrl} on this server`, 404);
    next(error);
};
