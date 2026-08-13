import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    PORT: z.coerce
        .number()
        .int()
        .min(1)
        .max(65535)
        .default(5000),

    MONGODB_URI: z
        .string()
        .min(1, "MONGODB_URI is required"),

    FRONTEND_URL: z
        .string()
        .url("FRONTEND_URL must be a valid URL"),

    JWT_ACCESS_SECRET: z
        .string()
        .min(32, "JWT_ACCESS_SECRET must contain at least 32 characters"),

    JWT_ACCESS_EXPIRES_IN: z
        .string()
        .min(1, "JWT_ACCESS_EXPIRES_IN is required"),

    JWT_REFRESH_SECRET: z
        .string()
        .min(32, "JWT_REFRESH_SECRET must contain at least 32 characters"),

    JWT_REFRESH_EXPIRES_IN: z
        .string()
        .min(1, "JWT_REFRESH_EXPIRES_IN is required"),

    SUPER_ADMIN_NAME: z.string().default("Super Admin"),
    SUPER_ADMIN_EMAIL: z.string().email().default("superadmin@admin.com"),
    SUPER_ADMIN_PASSWORD: z.string().min(8).default("SuperAdmin@123"),

    SUB_ADMIN_NAME: z.string().default("Sub Admin"),
    SUB_ADMIN_EMAIL: z.string().email().default("subadmin@admin.com"),
    SUB_ADMIN_PASSWORD: z.string().min(8).default("SubAdmin@123"),

    // SMTP Configuration
    SMTP_HOST: z.string().optional().default("smtp.gmail.com"),
    SMTP_PORT: z.coerce.number().optional().default(587),
    SMTP_USER: z.string().optional().default(""),
    SMTP_PASS: z.string().optional().default(""),
    SMTP_FROM_NAME: z.string().optional().default("Admin Panel Support"),
    SMTP_FROM_EMAIL: z.string().optional().default(""),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(" Invalid environment variables:");

    console.error(
        z.prettifyError(parsedEnv.error),
    );

    process.exit(1);
}

export const env = parsedEnv.data;