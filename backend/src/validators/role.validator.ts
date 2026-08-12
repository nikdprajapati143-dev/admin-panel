import { z } from "zod";
import { objectIdSchema } from "./common.validator.js";

export const createRoleSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, "Role name must be at least 2 characters")
            .trim()
            .transform((val) => val.toUpperCase()),
        description: z.string().trim().optional(),
        permissions: z.array(z.string()).min(1, "At least one permission is required"),
    }),
});

export const updateRoleSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
    body: z.object({
        name: z
            .string()
            .min(2, "Role name must be at least 2 characters")
            .trim()
            .transform((val) => val.toUpperCase())
            .optional(),
        description: z.string().trim().optional(),
        permissions: z.array(z.string()).optional(),
    }),
});
