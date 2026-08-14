import { z } from "zod";
import { CustomerStatus } from "../models/customer.model.js";
import { objectIdSchema } from "./common.validator.js";

export const kuwaitPhoneSchema = z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s-]/g, ""))
    .pipe(
        z
            .string()
            .regex(
                /^[569]\d{7}$/,
                "Invalid Kuwait phone number. Must be an 8-digit mobile number starting with 5, 6, or 9 (e.g. 61234567 or 91234567)",
            ),
    );

export const countryCodeSchema = z
    .string()
    .trim()
    .default("+965")
    .transform((val) => (val.startsWith("+") ? val : `+${val}`));

const avatarSchema = z.union([z.string(), z.any()]).optional();

export const createCustomerSchema = z.object({
    body: z.object({
        firstName: z.string().min(1, "First name is required").trim(),
        lastName: z.string().min(1, "Last name is required").trim(),
        email: z.string().email("Invalid email address"),
        countryCode: countryCodeSchema,
        phone: kuwaitPhoneSchema,
        avatar: avatarSchema,
        status: z.nativeEnum(CustomerStatus).optional(),
    }),
});

export const updateCustomerSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
    body: z.object({
        firstName: z.string().min(1, "First name is required").trim().optional(),
        lastName: z.string().min(1, "Last name is required").trim().optional(),
        email: z.string().email("Invalid email address").optional(),
        countryCode: countryCodeSchema.optional(),
        phone: kuwaitPhoneSchema.optional(),
        avatar: avatarSchema,
        status: z.nativeEnum(CustomerStatus).optional(),
    }),
});

export const updateCustomerStatusSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
    body: z.object({
        status: z.nativeEnum(CustomerStatus),
    }),
});

export const customerQuerySchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
        search: z.string().optional(),
        status: z.nativeEnum(CustomerStatus).optional(),
    }),
});
