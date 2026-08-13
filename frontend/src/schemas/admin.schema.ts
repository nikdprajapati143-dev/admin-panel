import * as yup from "yup";

export const createAdminSchema = yup.object().shape({
    name: yup.string().required("Name is required").trim(),
    email: yup
        .string()
        .required("Email address is required")
        .email("Must be a valid email address"),
    role: yup.string().required("Role selection is required"),
    status: yup.string().oneOf(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
    avatar: yup.mixed().optional(),
});

export const updateAdminSchema = yup.object().shape({
    name: yup.string().optional().trim(),
    email: yup.string().email("Must be a valid email address").optional(),
    role: yup.string().optional(),
    status: yup.string().oneOf(["ACTIVE", "INACTIVE"]).optional(),
    avatar: yup.mixed().optional(),
});

export type CreateAdminFormData = yup.InferType<typeof createAdminSchema>;
export type UpdateAdminFormData = yup.InferType<typeof updateAdminSchema>;
