import { Document, Schema, model } from "mongoose";

export enum FaqStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export interface IFaq extends Document {
    question: string;
    answer: string;
    category: string;
    status: FaqStatus;
    sortOrder: number;
    isDeleted: boolean;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const faqSchema = new Schema<IFaq>(
    {
        question: {
            type: String,
            required: [true, "Question is required"],
            trim: true,
        },
        answer: {
            type: String,
            required: [true, "Answer is required"],
            trim: true,
        },
        category: {
            type: String,
            default: "General",
            trim: true,
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(FaqStatus),
            default: FaqStatus.ACTIVE,
            index: true,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

faqSchema.index({ isDeleted: 1, status: 1 });

export const Faq = model<IFaq>("Faq", faqSchema);
