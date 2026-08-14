import { z } from "zod";
import { FaqStatus } from "../models/faq.model.js";
import { objectIdSchema } from "./common.validator.js";

export const createFaqSchema = z.object({
    body: z.object({
        question: z.string().min(5, "Question must be at least 5 characters").trim(),
        answer: z.string().min(5, "Answer must be at least 5 characters").trim(),
        category: z.string().optional().default("General"),
        status: z.nativeEnum(FaqStatus).optional().default(FaqStatus.ACTIVE),
        sortOrder: z
            .number()
            .int("Sort order must be an integer")
            .min(1, "Sort order must be a positive integer starting from 1")
            .optional()
            .default(1),
    }),
});

export const updateFaqSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
    body: z.object({
        question: z.string().min(5, "Question must be at least 5 characters").trim().optional(),
        answer: z.string().min(5, "Answer must be at least 5 characters").trim().optional(),
        category: z.string().optional(),
        status: z.nativeEnum(FaqStatus).optional(),
        sortOrder: z
            .number()
            .int("Sort order must be an integer")
            .min(1, "Sort order must be a positive integer starting from 1")
            .optional(),
    }),
});

export const updateFaqStatusSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
    body: z.object({
        status: z.nativeEnum(FaqStatus),
    }),
});

export const faqQuerySchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
        search: z.string().optional(),
        category: z.string().optional(),
        status: z.nativeEnum(FaqStatus).optional(),
    }),
});
