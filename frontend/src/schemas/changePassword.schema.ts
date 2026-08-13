import * as yup from "yup";

export const changePasswordSchema = yup.object().shape({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup
        .string()
        .required("New password is required")
        .min(6, "New password must be at least 6 characters"),
    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;
