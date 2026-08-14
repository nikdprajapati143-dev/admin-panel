import type { ApiResponse } from "./auth.js";

export interface FaqItem {
    id: string;
    _id: string;
    question: string;
    answer: string;
    category: string;
    status: "ACTIVE" | "INACTIVE";
    sortOrder: number;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface FaqListApiResponse extends ApiResponse<FaqItem[]> {
    data: FaqItem[];
    meta?: {
        totalDocs?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
    };
}

export interface FaqDetailApiResponse extends ApiResponse<FaqItem> {
    data: FaqItem;
}

export interface GetFaqsQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
}

export interface CreateFaqPayload {
    question: string;
    answer: string;
    category?: string;
    status?: "ACTIVE" | "INACTIVE";
    sortOrder?: number;
}

export interface UpdateFaqPayload {
    id: string;
    data: Partial<CreateFaqPayload>;
}

export interface ToggleFaqStatusPayload {
    id: string;
    newStatus: "ACTIVE" | "INACTIVE";
}
