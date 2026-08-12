import { IRole } from "../models/role.model.js";
import { AdminRepository } from "../repositories/admin.repository.js";
import { AppError } from "../utils/appError.js";
import {
    generateAccessToken,
    generateRefreshToken,
    generateResetPasswordToken,
    hashResetToken,
    verifyRefreshToken,
} from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";

export class AuthService {
    private adminRepository: AdminRepository;

    constructor() {
        this.adminRepository = new AdminRepository();
    }

    async login(
        email: string,
        password: string,
    ): Promise<{ accessToken: string; refreshToken: string; admin: unknown }> {
        const admin = await this.adminRepository.findByEmail(email, true, false);

        if (!admin || !admin.password) {
            throw new AppError("Invalid email or password", 401);
        }

        if (admin.isDeleted || admin.status !== "ACTIVE") {
            throw new AppError("Account is inactive or deleted", 403);
        }

        const isPasswordMatch = await comparePassword(password, admin.password);

        if (!isPasswordMatch) {
            throw new AppError("Invalid email or password", 401);
        }

        const role = admin.role as unknown as IRole;

        const payload = {
            id: admin._id.toString(),
            email: admin.email,
            role: role ? role.name : "SUB_ADMIN",
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await this.adminRepository.updateRefreshToken(admin._id.toString(), refreshToken);

        const adminObj = admin.toObject();
        delete adminObj.password;
        delete adminObj.refreshToken;

        return {
            accessToken,
            refreshToken,
            admin: adminObj,
        };
    }

    async logout(adminId: string): Promise<void> {
        await this.adminRepository.updateRefreshToken(adminId, null);
    }

    async refreshToken(
        incomingRefreshToken: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        let decoded;
        try {
            decoded = verifyRefreshToken(incomingRefreshToken);
        } catch {
            throw new AppError("Invalid or expired refresh token. Please login again.", 401);
        }

        const admin = await this.adminRepository.findByEmail(decoded.email, false, true);

        if (!admin || !admin.refreshToken || admin.refreshToken !== incomingRefreshToken) {
            throw new AppError("Invalid refresh token", 401);
        }

        if (admin.status !== "ACTIVE" || admin.isDeleted) {
            throw new AppError("Account is inactive or deleted", 403);
        }

        const role = admin.role as unknown as IRole;

        const payload = {
            id: admin._id.toString(),
            email: admin.email,
            role: role ? role.name : "SUB_ADMIN",
        };

        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        await this.adminRepository.updateRefreshToken(admin._id.toString(), newRefreshToken);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    async forgotPassword(email: string): Promise<{ resetToken: string }> {
        const admin = await this.adminRepository.findByEmail(email);

        if (!admin) {
            throw new AppError("No admin account found with that email address", 404);
        }

        const { resetToken, hashedToken, expiresAt } = generateResetPasswordToken();

        await this.adminRepository.setPasswordResetToken(
            admin._id.toString(),
            hashedToken,
            expiresAt,
        );

        return { resetToken };
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const hashedToken = hashResetToken(token);

        const admin = await this.adminRepository.findByResetToken(hashedToken);

        if (!admin) {
            throw new AppError("Reset token is invalid or has expired", 400);
        }

        const hashedPassword = await hashPassword(newPassword);

        await this.adminRepository.updatePassword(admin._id.toString(), hashedPassword);
    }

    async changePassword(
        adminId: string,
        currentPassword: string,
        newPassword: string,
    ): Promise<void> {
        const admin = await this.adminRepository.findById(adminId);

        if (!admin) {
            throw new AppError("Admin not found", 404);
        }

        const fullAdmin = await this.adminRepository.findByEmail(admin.email, true, false);

        if (!fullAdmin || !fullAdmin.password) {
            throw new AppError("Admin account error", 500);
        }

        const isMatch = await comparePassword(currentPassword, fullAdmin.password);

        if (!isMatch) {
            throw new AppError("Current password is incorrect", 400);
        }

        const hashedPassword = await hashPassword(newPassword);

        await this.adminRepository.updatePassword(adminId, hashedPassword);
    }

    async updateProfile(
        adminId: string,
        data: { name?: string; email?: string; avatar?: string },
    ): Promise<unknown> {
        if (data.email) {
            const existing = await this.adminRepository.findByEmail(data.email);
            if (existing && existing._id.toString() !== adminId) {
                throw new AppError("Email address is already in use by another admin", 409);
            }
        }

        const updatedAdmin = await this.adminRepository.update(adminId, data);
        if (!updatedAdmin) {
            throw new AppError("Admin not found", 404);
        }

        return updatedAdmin;
    }
}
