import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, HelpCircle, Loader2 } from "lucide-react";
import { FaqForm } from "../../components/faqs/FaqForm.js";
import { useFaq, useUpdateFaq } from "../../hooks/useFaqs.js";

export const FaqEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: faqRes, isLoading: isFaqLoading } = useFaq(id || "");
    const updateFaqMutation = useUpdateFaq();

    const faq = faqRes?.data;

    const handleSubmit = (data: any) => {
        if (!id) return;
        updateFaqMutation.mutate(
            { id, data },
            {
                onSuccess: () => {
                    navigate("/admin/faqs");
                },
            },
        );
    };

    if (isFaqLoading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center text-[#64748B] dark:text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#164E50] dark:text-teal-400 mb-2" />
                <p className="text-xs font-medium">Loading FAQ details...</p>
            </div>
        );
    }

    if (!faq) {
        return (
            <div className="p-8 text-center text-[#64748B] dark:text-slate-400">
                <p className="font-bold text-sm">FAQ Entry Not Found</p>
                <button
                    onClick={() => navigate("/admin/faqs")}
                    className="mt-3 px-4 py-2 rounded-full bg-[#164E50] text-white text-xs font-semibold"
                >
                    Back to FAQ List
                </button>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* Navigation Header */}
            <div>
                <button
                    onClick={() => navigate("/admin/faqs")}
                    className="inline-flex items-center gap-1.5 text-xs text-[#64748B] dark:text-slate-400 hover:text-[#164E50] dark:hover:text-teal-300 font-medium mb-3 transition cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to FAQ List</span>
                </button>

                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#164E50]/10 dark:bg-[#164E50]/30 flex items-center justify-center text-[#164E50] dark:text-teal-300">
                        <HelpCircle className="w-4 h-4" />
                    </div>
                    <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white">
                        Edit FAQ
                    </h2>
                </div>
                <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
                    Update question content, category, or publication status.
                </p>
            </div>

            {/* FAQ Form Card */}
            <div className="bg-white dark:bg-[#162D32] rounded-2xl p-6 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs">
                <FaqForm
                    initialData={faq}
                    isLoading={updateFaqMutation.isPending}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/admin/faqs")}
                />
            </div>
        </div>
    );
};
