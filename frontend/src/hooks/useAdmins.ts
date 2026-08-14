import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "../constants/queryKeys.js";
import { adminService } from "../services/admin.service.js";
import type { GetAdminsQueryParams, ToggleAdminStatusPayload } from "../types/admin.types.js";

// 1. Fetch Paginated List of Admins
export const useAdmins = (params?: GetAdminsQueryParams) => {
    return useQuery({
        queryKey: adminKeys.list(params),
        queryFn: () => adminService.getAdmins(params),
    });
};

// 2. Fetch Single Admin Details
export const useAdmin = (id?: string) => {
    return useQuery({
        queryKey: adminKeys.detail(id || ""),
        queryFn: () => adminService.getAdminById(id!),
        enabled: Boolean(id),
    });
};

// 3. Create Admin Mutation
export const useCreateAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => adminService.createAdmin(data),
        onSuccess: () => {
            toast.success("Admin created successfully!");
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to create admin";
            toast.error(msg);
        },
    });
};

// 4. Update Admin Mutation
export const useUpdateAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) =>
            adminService.updateAdmin(id, data),
        onSuccess: (_data, variables) => {
            toast.success("Admin updated successfully!");
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
            queryClient.invalidateQueries({ queryKey: adminKeys.detail(variables.id) });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to update admin";
            toast.error(msg);
        },
    });
};

// 5. Toggle Admin Status Mutation
export const useToggleAdminStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ToggleAdminStatusPayload) =>
            adminService.updateAdminStatus(payload),
        onSuccess: (_data, variables) => {
            if (variables.newStatus === "ACTIVE") {
                toast.success("Admin Activated successfully!");
            } else {
                toast.success("Admin Deactivated successfully!");
            }
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
            queryClient.invalidateQueries({ queryKey: adminKeys.detail(variables.id) });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to update admin status";
            toast.error(msg);
        },
    });
};

// 6. Delete Admin Mutation
export const useDeleteAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => adminService.deleteAdmin(id),
        onSuccess: () => {
            toast.success("Admin deleted successfully!");
            queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to delete admin";
            toast.error(msg);
        },
    });
};
