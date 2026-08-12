import { NextFunction, Request, Response } from "express";
import { AdminRepository } from "../repositories/admin.repository.js";
import { PopulatedAdmin } from "../types/express.d.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";

const adminRepository = new AdminRepository();

export const authenticate = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        let token: string | undefined;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            throw new AppError("Authentication required. Please provide a valid Bearer token.", 401);
        }

        const decoded = verifyAccessToken(token);

        const admin = await adminRepository.findById(decoded.id);

        if (!admin) {
            throw new AppError("The user belonging to this token no longer exists.", 401);
        }

        if (admin.status !== "ACTIVE") {
            throw new AppError("Your account is currently inactive. Please contact support.", 403);
        }

        if (admin.isDeleted) {
            throw new AppError("Account not found or deleted.", 401);
        }

        req.user = admin as unknown as PopulatedAdmin;

        next();
    },
);
