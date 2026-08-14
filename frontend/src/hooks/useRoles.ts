import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleKeys } from "../constants/queryKeys.js";
import { roleService } from "../services/role.service.js";
import type { GetRolesQueryParams } from "../types/role.types.js";
import type { RoleFormData } from "../schemas/role.schema.js";

// 1. Fetch Paginated List of Roles
export const useRoles = (params?: GetRolesQueryParams) => {
    return useQuery({
        queryKey: roleKeys.list(params),
        queryFn: () => roleService.getRoles(params),
    });
};

// 2. Fetch Single Role Details
export const useRole = (id?: string) => {
    return useQuery({
        queryKey: roleKeys.detail(id || ""),
        queryFn: () => roleService.getRoleById(id!),
        enabled: Boolean(id),
    });
};

// 3. Create Role Mutation
export const useCreateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RoleFormData) => roleService.createRole(data),
        onSuccess: () => {
            toast.success("Role created successfully!");
            queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to create role";
            toast.error(msg);
        },
    });
};

// 4. Update Role Mutation
export const useUpdateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RoleFormData }) =>
            roleService.updateRole(id, data),
        onSuccess: (_data, variables) => {
            toast.success("Role updated successfully!");
            queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
            queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to update role";
            toast.error(msg);
        },
    });
};

// 5. Delete Role Mutation
export const useDeleteRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => roleService.deleteRole(id),
        onSuccess: () => {
            toast.success("Role soft-deleted successfully!");
            queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to delete role";
            toast.error(msg);
        },
    });
};
