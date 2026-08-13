import * as yup from "yup";

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email address is required")
        .email("Must be a valid email address"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    rememberMe: yup.boolean().optional(),
});

export const forgotPasswordSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email address is required")
        .email("Must be a valid email address"),
});

export const resetPasswordSchema = yup.object().shape({
    token: yup.string().required("Reset token is required"),
    password: yup
        .string()
        .required("New password is required")
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
