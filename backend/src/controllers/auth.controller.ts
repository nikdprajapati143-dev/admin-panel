import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { AdminTransformer } from "../transformers/admin.transformer.js";
import { successResponse } from "../utils/apiResponse.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getRefreshTokenCookieOptions } from "../utils/jwt.js";

const authService = new AuthService();

export class AuthController {
    login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        const { accessToken, refreshToken, admin } = await authService.login(
            email,
            password,
        );

        res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

        successResponse(res, "Login successful", {
            accessToken,
            admin: AdminTransformer.transform(admin as any),
        });
    });

    logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        if (req.user) {
            await authService.logout(req.user._id.toString());
        }

        res.clearCookie("refreshToken", getRefreshTokenCookieOptions());

        successResponse(res, "Logout successful");
    });

    refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const tokenFromCookie = req.cookies?.refreshToken;
        const tokenFromBody = req.body?.refreshToken;
        const incomingToken = tokenFromCookie || tokenFromBody;

        if (!incomingToken) {
            throw new AppError("Refresh token missing", 401);
        }

        const { accessToken, refreshToken } = await authService.refreshToken(
            incomingToken,
        );

        res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

        successResponse(res, "Token refreshed successfully", { accessToken });
    });

    forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body;

        const { resetToken } = await authService.forgotPassword(email);

        successResponse(
            res,
            "Password reset token generated successfully",
            { resetToken },
        );
    });

    resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { token, password } = req.body;

        await authService.resetPassword(token, password);

        successResponse(res, "Password reset successfully. You can now log in with your new password.");
    });

    changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const adminId = req.user!._id.toString();
        const { currentPassword, newPassword } = req.body;

        await authService.changePassword(adminId, currentPassword, newPassword);

        res.clearCookie("refreshToken", getRefreshTokenCookieOptions());

        successResponse(
            res,
            "Password changed successfully. Active sessions invalidated. Please log in again.",
        );
    });

    getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        successResponse(res, "Profile retrieved successfully", AdminTransformer.transform(req.user as any));
    });

    updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const adminId = req.user!._id.toString();
        const avatar = req.file ? `/uploads/${req.file.filename}` : req.body.avatar;
        const updatedAdmin = await authService.updateProfile(adminId, {
            ...req.body,
            ...(avatar && { avatar }),
        });

        successResponse(res, "Profile updated successfully", AdminTransformer.transform(updatedAdmin as any));
    });
}
