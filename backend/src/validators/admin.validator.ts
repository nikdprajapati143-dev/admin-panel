import { z } from "zod";
import { AdminStatus } from "../models/admin.model.js";
import { objectIdSchema } from "./common.validator.js";

export const createAdminSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters").trim(),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                "Password must contain uppercase, lowercase, number and special character",
            ),
        role: objectIdSchema,
        avatar: z.string().optional(),
        status: z.nativeEnum(AdminStatus).optional(),
    }),
});

export const updateAdminSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters").trim().optional(),
        email: z.string().email("Invalid email address").optional(),
        role: objectIdSchema.optional(),
        avatar: z.string().optional(),
        status: z.nativeEnum(AdminStatus).optional(),
    }),
});

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters").trim().optional(),
        email: z.string().email("Invalid email address").optional(),
        avatar: z.string().optional(),
    }),
});
