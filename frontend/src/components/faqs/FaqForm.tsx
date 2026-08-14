import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { HelpCircle, Loader2, Save, X, AlignLeft, ArrowUpDown } from "lucide-react";
import { createFaqSchema, updateFaqSchema } from "../../schemas/faq.schema.js";
import type { FaqItem } from "../../types/faq.types.js";

interface FaqFormProps {
    initialData?: FaqItem | null;
    isLoading?: boolean;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export const FaqForm: React.FC<FaqFormProps> = ({
    initialData,
    isLoading = false,
    onSubmit,
    onCancel,
}) => {
    const isEdit = Boolean(initialData);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(isEdit ? (updateFaqSchema as any) : (createFaqSchema as any)),
    });

    useEffect(() => {
        if (initialData) {
            reset({
                question: initialData.question || "",
                answer: initialData.answer || "",
                sortOrder: initialData.sortOrder ?? 1,
            });
        } else {
            reset({
                question: "",
                answer: "",
                sortOrder: 1,
            });
        }
    }, [initialData, reset]);

    const handleFormSubmit = (data: any) => {
        onSubmit({
            ...data,
            category: initialData?.category || "General",
            status: initialData?.status || "ACTIVE",
            sortOrder: Number(data.sortOrder) || 1,
        });
    };

    const handleSortOrderKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Prevent minus sign, exponential 'e', and decimal point '.'
        if (["-", "e", "E", "."].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Question Field */}
            <div>
                <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                    Question <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] dark:text-slate-400">
                        <HelpCircle className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="e.g. How do I reset my account password?"
                        {...register("question")}
                        className={`w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#122529] border ${
                            errors.question
                                ? "border-red-500 focus:ring-red-500"
                                : "border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500"
                        } rounded-xl text-xs text-[#1E293B] dark:text-white placeholder-[#64748B]/60 dark:placeholder-slate-500 outline-hidden transition`}
                    />
                </div>
                {errors.question && (
                    <p className="mt-1 text-xs text-red-500">{errors.question.message as string}</p>
                )}
            </div>

            {/* Answer Field */}
            <div>
                <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                    Answer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-[#64748B] dark:text-slate-400">
                        <AlignLeft className="w-4 h-4" />
                    </div>
                    <textarea
                        rows={5}
                        placeholder="Provide a clear and concise answer..."
                        {...register("answer")}
                        className={`w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#122529] border ${
                            errors.answer
                                ? "border-red-500 focus:ring-red-500"
                                : "border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500"
                        } rounded-xl text-xs text-[#1E293B] dark:text-white placeholder-[#64748B]/60 dark:placeholder-slate-500 outline-hidden transition resize-y`}
                    />
                </div>
                {errors.answer && (
                    <p className="mt-1 text-xs text-red-500">{errors.answer.message as string}</p>
                )}
            </div>

            {/* Sort Order Field (Half-width col-6 layout, minimum 1, disallows minus/negative) */}
            <div className="w-full sm:w-1/2">
                <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                    Sort Order <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] dark:text-slate-400">
                        <ArrowUpDown className="w-4 h-4" />
                    </div>
                    <input
                        type="number"
                        min="1"
                        placeholder="1"
                        onKeyDown={handleSortOrderKeyDown}
                        {...register("sortOrder")}
                        className={`w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#122529] border ${
                            errors.sortOrder
                                ? "border-red-500 focus:ring-red-500"
                                : "border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500"
                        } rounded-xl text-xs text-[#1E293B] dark:text-white placeholder-[#64748B]/60 dark:placeholder-slate-500 outline-hidden transition`}
                    />
                </div>
                {errors.sortOrder && (
                    <p className="mt-1 text-xs text-red-500">{errors.sortOrder.message as string}</p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D8] dark:border-[#254C54]">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-full border border-[#E5E0D8] dark:border-[#254C54] text-[#64748B] dark:text-slate-300 hover:bg-[#F7F5F0] dark:hover:bg-[#122529] text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] text-white text-xs font-semibold transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{isEdit ? "Updating..." : "Creating..."}</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            <span>{isEdit ? "Update FAQ" : "Create FAQ"}</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};
