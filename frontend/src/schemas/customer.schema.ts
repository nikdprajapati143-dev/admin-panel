import * as yup from "yup";

export const kuwaitPhoneRegex = /^[569]\d{7}$/;

export const createCustomerSchema = yup.object().shape({
    firstName: yup.string().required("First name is required").trim(),
    lastName: yup.string().required("Last name is required").trim(),
    email: yup
        .string()
        .required("Email address is required")
        .email("Must be a valid email address"),
    countryCode: yup.string().default("+965").required("Country code is required"),
    phone: yup
        .string()
        .required("Phone number is required")
        .matches(
            kuwaitPhoneRegex,
            "Must be a valid 8-digit Kuwait mobile number starting with 5, 6, or 9 (e.g. 61234567)",
        ),
    status: yup.string().oneOf(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
    avatar: yup.mixed().optional(),
});

export const updateCustomerSchema = yup.object().shape({
    firstName: yup.string().optional().trim(),
    lastName: yup.string().optional().trim(),
    email: yup.string().email("Must be a valid email address").optional(),
    countryCode: yup.string().optional(),
    phone: yup
        .string()
        .optional()
        .transform((val) => (val === "" ? undefined : val))
        .matches(
            kuwaitPhoneRegex,
            "Must be a valid 8-digit Kuwait mobile number starting with 5, 6, or 9 (e.g. 61234567)",
        ),
    status: yup.string().oneOf(["ACTIVE", "INACTIVE"]).optional(),
    avatar: yup.mixed().optional(),
});

export type CreateCustomerFormData = yup.InferType<typeof createCustomerSchema>;
export type UpdateCustomerFormData = yup.InferType<typeof updateCustomerSchema>;
