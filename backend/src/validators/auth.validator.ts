import { z } from "zod";

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
        rememberMe: z.boolean().optional(),
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
    }),
});

export const resetPasswordSchema = z.object({
    body: z
        .object({
            token: z.string().min(1, "Reset token is required"),
            password: z
                .string()
                .min(8, "Password must be at least 8 characters")
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                    "Password must contain uppercase, lowercase, number and special character",
                ),
            confirmPassword: z.string().min(1, "Confirm password is required").optional(),
        })
        .refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }),
});

export const changePasswordSchema = z.object({
    body: z
        .object({
            currentPassword: z.string().min(1, "Current password is required"),
            newPassword: z
                .string()
                .min(8, "New password must be at least 8 characters")
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                    "New password must contain uppercase, lowercase, number and special character",
                ),
            confirmPassword: z.string().min(1, "Confirm password is required").optional(),
        })
        .refine((data) => !data.confirmPassword || data.newPassword === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }),
});
