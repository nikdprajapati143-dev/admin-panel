import { Faq, FaqStatus, IFaq } from "../models/faq.model.js";
import { PaginationOptions } from "../utils/pagination.js";

export class FaqRepository {
    async create(faqData: Partial<IFaq>): Promise<IFaq> {
        return await Faq.create(faqData);
    }

    async findById(id: string): Promise<IFaq | null> {
        return await Faq.findOne({ _id: id, isDeleted: false });
    }

    async findBySortOrder(sortOrder: number): Promise<IFaq | null> {
        return await Faq.findOne({ sortOrder, isDeleted: false });
    }

    async findPaginated(
        filter: Record<string, any> = {},
        pagination?: PaginationOptions,
    ): Promise<{ docs: IFaq[]; totalDocs: number }> {
        const queryFilter = { ...filter, isDeleted: false };
        const totalDocs = await Faq.countDocuments(queryFilter);

        let query = Faq.find(queryFilter);

        if (pagination) {
            query = query
                .sort({ [pagination.sortBy]: pagination.sortOrder, createdAt: -1 })
                .skip(pagination.skip)
                .limit(pagination.limit);
        } else {
            query = query.sort({ sortOrder: 1, createdAt: -1 });
        }

        const docs = await query.exec();
        return { docs, totalDocs };
    }

    async update(id: string, updateData: Partial<IFaq>): Promise<IFaq | null> {
        return await Faq.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updateData },
            { returnDocument: "after", runValidators: true },
        );
    }

    async updateStatus(id: string, status: FaqStatus): Promise<IFaq | null> {
        return await Faq.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { status } },
            { returnDocument: "after", runValidators: true },
        );
    }

    async softDelete(id: string): Promise<IFaq | null> {
        return await Faq.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { returnDocument: "after" },
        );
    }

    async getDistinctCategories(): Promise<string[]> {
        return await Faq.distinct("category", { isDeleted: false });
    }
}
