import { IFaq } from "../models/faq.model.js";

export class FaqTransformer {
    static transform(faq: IFaq | Record<string, any>) {
        if (!faq) return null;
        const obj = typeof (faq as any).toObject === "function" ? (faq as any).toObject() : faq;

        return {
            id: obj._id ? obj._id.toString() : obj.id,
            _id: obj._id ? obj._id.toString() : obj.id,
            question: obj.question,
            answer: obj.answer,
            category: obj.category || "General",
            status: obj.status,
            sortOrder: obj.sortOrder ?? 0,
            isDeleted: obj.isDeleted ?? false,
            deletedAt: obj.deletedAt || null,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
        };
    }

    static transformMany(faqs: (IFaq | Record<string, any>)[]) {
        return faqs.map((faq) => this.transform(faq));
    }
}
