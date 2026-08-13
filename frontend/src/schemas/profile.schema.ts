import * as yup from "yup";

export const profileSchema = yup.object().shape({
    name: yup.string().required("Full name is required").trim(),
    email: yup
        .string()
        .required("Email address is required")
        .email("Must be a valid email address"),
    avatar: yup.mixed().optional(),
});

export type ProfileFormData = yup.InferType<typeof profileSchema>;
