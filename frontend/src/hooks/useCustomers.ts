import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerKeys } from "../constants/queryKeys.js";
import { customerService } from "../services/customer.service.js";
import type { GetCustomersQueryParams, ToggleCustomerStatusPayload } from "../types/customer.types.js";

// 1. Fetch Paginated List of Customers
export const useCustomers = (params?: GetCustomersQueryParams) => {
    return useQuery({
        queryKey: customerKeys.list(params),
        queryFn: () => customerService.getCustomers(params),
    });
};

// 2. Fetch Single Customer Details
export const useCustomer = (id?: string) => {
    return useQuery({
        queryKey: customerKeys.detail(id || ""),
        queryFn: () => customerService.getCustomerById(id!),
        enabled: Boolean(id),
    });
};

// 3. Create Customer Mutation
export const useCreateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => customerService.createCustomer(data),
        onSuccess: () => {
            toast.success("Customer created successfully!");
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to create customer";
            toast.error(msg);
        },
    });
};

// 4. Update Customer Mutation
export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) =>
            customerService.updateCustomer(id, data),
        onSuccess: (_data, variables) => {
            toast.success("Customer updated successfully!");
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to update customer";
            toast.error(msg);
        },
    });
};

// 5. Toggle Customer Status Mutation
export const useToggleCustomerStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ToggleCustomerStatusPayload) =>
            customerService.updateCustomerStatus(payload),
        onSuccess: (_data, variables) => {
            if (variables.newStatus === "ACTIVE") {
                toast.success("Customer Activated successfully!");
            } else {
                toast.success("Customer Deactivated successfully!");
            }
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to update customer status";
            toast.error(msg);
        },
    });
};

// 6. Delete Customer Mutation
export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => customerService.deleteCustomer(id),
        onSuccess: () => {
            toast.success("Customer deleted successfully!");
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to delete customer";
            toast.error(msg);
        },
    });
};
