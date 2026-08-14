import * as yup from "yup";

export const createFaqSchema = yup.object().shape({
    question: yup
        .string()
        .required("Question is required")
        .min(5, "Question must be at least 5 characters")
        .trim(),
    answer: yup
        .string()
        .required("Answer is required")
        .min(5, "Answer must be at least 5 characters")
        .trim(),
    category: yup.string().default("General").trim(),
    status: yup.string().oneOf(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
    sortOrder: yup
        .number()
        .typeError("Sort order must be a number")
        .required("Sort order is required")
        .integer("Sort order must be an integer")
        .min(1, "Sort order must be at least 1 (negative numbers not allowed)")
        .default(1),
});

export const updateFaqSchema = yup.object().shape({
    question: yup
        .string()
        .optional()
        .min(5, "Question must be at least 5 characters")
        .trim(),
    answer: yup
        .string()
        .optional()
        .min(5, "Answer must be at least 5 characters")
        .trim(),
    category: yup.string().optional().trim(),
    status: yup.string().oneOf(["ACTIVE", "INACTIVE"]).optional(),
    sortOrder: yup
        .number()
        .typeError("Sort order must be a number")
        .optional()
        .integer("Sort order must be an integer")
        .min(1, "Sort order must be at least 1 (negative numbers not allowed)"),
});

export type CreateFaqFormData = yup.InferType<typeof createFaqSchema>;
export type UpdateFaqFormData = yup.InferType<typeof updateFaqSchema>;
