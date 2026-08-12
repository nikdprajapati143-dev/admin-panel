import { Response } from "express";

export interface ApiResponseOptions<T = unknown> {
    statusCode: number;
    message: string;
    data?: T;
    meta?: unknown;
}

export const sendResponse = <T>(
    res: Response,
    { statusCode, message, data, meta }: ApiResponseOptions<T>,
): Response => {
    const responsePayload: Record<string, unknown> = {
        success: statusCode >= 200 && statusCode < 300,
        statusCode,
        message,
    };

    if (data !== undefined) {
        responsePayload.data = data;
    }

    if (meta !== undefined) {
        responsePayload.meta = meta;
    }

    return res.status(statusCode).json(responsePayload);
};

export const successResponse = <T>(
    res: Response,
    message = "Operation successful",
    data?: T,
    meta?: unknown,
): Response => {
    return sendResponse(res, { statusCode: 200, message, data, meta });
};

export const createdResponse = <T>(
    res: Response,
    message = "Resource created successfully",
    data?: T,
): Response => {
    return sendResponse(res, { statusCode: 201, message, data });
};

export const badRequest = (
    res: Response,
    message = "Bad request",
    errors?: unknown,
): Response => {
    return res.status(400).json({
        success: false,
        statusCode: 400,
        message,
        ...(errors !== undefined && { errors }),
    });
};

export const unauthorized = (
    res: Response,
    message = "Unauthorized access",
): Response => {
    return res.status(401).json({
        success: false,
        statusCode: 401,
        message,
    });
};

export const forbidden = (
    res: Response,
    message = "Access forbidden",
): Response => {
    return res.status(403).json({
        success: false,
        statusCode: 403,
        message,
    });
};

export const notFound = (
    res: Response,
    message = "Resource not found",
): Response => {
    return res.status(404).json({
        success: false,
        statusCode: 404,
        message,
    });
};

export const conflict = (
    res: Response,
    message = "Resource conflict",
): Response => {
    return res.status(409).json({
        success: false,
        statusCode: 409,
        message,
    });
};

export const internalServerError = (
    res: Response,
    message = "Internal server error",
): Response => {
    return res.status(500).json({
        success: false,
        statusCode: 500,
        message,
    });
};
