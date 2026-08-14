import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { faqKeys } from "../constants/queryKeys.js";
import { faqService } from "../services/faq.service.js";
import type {
    CreateFaqPayload,
    GetFaqsQueryParams,
    ToggleFaqStatusPayload,
    UpdateFaqPayload,
} from "../types/faq.types.js";

/**
 * Fetch paginated list of FAQs
 */
export const useFaqs = (params?: GetFaqsQueryParams) => {
    return useQuery({
        queryKey: faqKeys.list(params),
        queryFn: () => faqService.getFaqs(params),
        placeholderData: (previousData) => previousData,
    });
};

/**
 * Fetch single FAQ by ID
 */
export const useFaq = (id: string, enabled = true) => {
    return useQuery({
        queryKey: faqKeys.detail(id),
        queryFn: () => faqService.getFaqById(id),
        enabled: Boolean(id) && enabled,
    });
};

/**
 * Fetch FAQ categories
 */
export const useFaqCategories = () => {
    return useQuery({
        queryKey: faqKeys.categories(),
        queryFn: () => faqService.getCategories(),
    });
};

/**
 * Create new FAQ mutation
 */
export const useCreateFaq = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateFaqPayload) => faqService.createFaq(data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
            queryClient.invalidateQueries({ queryKey: faqKeys.categories() });
            toast.success(res.message || "FAQ created successfully");
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Failed to create FAQ";
            toast.error(msg);
        },
    });
};

/**
 * Update FAQ details mutation
 */
export const useUpdateFaq = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateFaqPayload) => faqService.updateFaq(id, data),
        onSuccess: (res, { id }) => {
            queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
            queryClient.invalidateQueries({ queryKey: faqKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: faqKeys.categories() });
            toast.success(res.message || "FAQ updated successfully");
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Failed to update FAQ";
            toast.error(msg);
        },
    });
};

/**
 * Toggle FAQ Status mutation (ACTIVE/INACTIVE)
 */
export const useUpdateFaqStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, newStatus }: ToggleFaqStatusPayload) =>
            faqService.updateFaqStatus({ id, newStatus }),
        onSuccess: (_res, { newStatus }) => {
            queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
            const message = newStatus === "ACTIVE" ? "FAQ activated" : "FAQ deactivated";
            toast.success(message);
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Failed to update FAQ status";
            toast.error(msg);
        },
    });
};

/**
 * Soft-delete FAQ mutation
 */
export const useDeleteFaq = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => faqService.deleteFaq(id),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
            queryClient.invalidateQueries({ queryKey: faqKeys.categories() });
            toast.success(res.message || "FAQ deleted successfully");
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Failed to delete FAQ";
            toast.error(msg);
        },
    });
};
