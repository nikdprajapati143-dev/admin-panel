import { FaqStatus, IFaq } from "../models/faq.model.js";
import { FaqRepository } from "../repositories/faq.repository.js";
import { AppError } from "../utils/appError.js";
import { formatPaginatedMeta, getPaginationOptions, PaginationQuery } from "../utils/pagination.js";

export class FaqService {
    private faqRepository: FaqRepository;

    constructor() {
        this.faqRepository = new FaqRepository();
    }

    async createFaq(data: {
        question: string;
        answer: string;
        category?: string;
        status?: FaqStatus;
        sortOrder?: number;
    }): Promise<IFaq> {
        const sortOrder = Number(data.sortOrder) || 1;
        if (sortOrder < 1) {
            throw new AppError("Sort order must be a positive integer starting from 1", 400);
        }

        const existingSort = await this.faqRepository.findBySortOrder(sortOrder);
        if (existingSort) {
            throw new AppError(
                `Sort order ${sortOrder} is already in use. Please enter a unique sort order.`,
                409,
            );
        }

        return await this.faqRepository.create({
            question: data.question,
            answer: data.answer,
            category: data.category || "General",
            status: data.status || FaqStatus.ACTIVE,
            sortOrder,
        });
    }

    async getFaqById(id: string): Promise<IFaq> {
        const faq = await this.faqRepository.findById(id);
        if (!faq) {
            throw new AppError("FAQ not found", 404);
        }
        return faq;
    }

    async getAllFaqs(
        queryParams: PaginationQuery & { search?: string; status?: string; category?: string },
    ) {
        const { search, status, category, ...restQuery } = queryParams;
        const pagination = getPaginationOptions(restQuery);

        const filter: Record<string, any> = {};

        if (status && status !== "ALL") {
            filter.status = status;
        }

        if (category && category !== "ALL") {
            filter.category = category;
        }

        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");
            filter.$or = [
                { question: searchRegex },
                { answer: searchRegex },
                { category: searchRegex },
            ];
        }

        const { docs, totalDocs } = await this.faqRepository.findPaginated(filter, pagination);
        const meta = formatPaginatedMeta(totalDocs, pagination.page, pagination.limit);

        return { docs, meta };
    }

    async updateFaq(
        id: string,
        data: {
            question?: string;
            answer?: string;
            category?: string;
            status?: FaqStatus;
            sortOrder?: number;
        },
    ): Promise<IFaq> {
        await this.getFaqById(id);

        if (data.sortOrder !== undefined && data.sortOrder !== null) {
            const sortOrder = Number(data.sortOrder);
            if (sortOrder < 1) {
                throw new AppError("Sort order must be a positive integer starting from 1", 400);
            }

            const existingSort = await this.faqRepository.findBySortOrder(sortOrder);
            if (existingSort && existingSort._id.toString() !== id) {
                throw new AppError(
                    `Sort order ${sortOrder} is already in use. Please enter a unique sort order.`,
                    409,
                );
            }
        }

        const updated = await this.faqRepository.update(id, data);
        if (!updated) {
            throw new AppError("Failed to update FAQ", 500);
        }
        return updated;
    }

    async updateFaqStatus(id: string, status: FaqStatus): Promise<IFaq> {
        await this.getFaqById(id);
        const updated = await this.faqRepository.updateStatus(id, status);
        if (!updated) {
            throw new AppError("Failed to update FAQ status", 500);
        }
        return updated;
    }

    async softDeleteFaq(id: string): Promise<void> {
        await this.getFaqById(id);
        await this.faqRepository.softDelete(id);
    }

    async getCategories(): Promise<string[]> {
        return await this.faqRepository.getDistinctCategories();
    }
}
