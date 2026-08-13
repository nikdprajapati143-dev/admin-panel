import * as yup from "yup";

export const roleSchema = yup.object().shape({
    name: yup.string().required("Role name is required").trim(),
    description: yup.string().optional().trim(),
    permissions: yup
        .array()
        .of(yup.string().required())
        .min(1, "Select at least one permission")
        .required("Permissions are required"),
});

export type RoleFormData = yup.InferType<typeof roleSchema>;
