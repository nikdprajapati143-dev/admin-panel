import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { FaqForm } from "../../components/faqs/FaqForm.js";
import { useCreateFaq } from "../../hooks/useFaqs.js";

export const FaqCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const createFaqMutation = useCreateFaq();

    const handleSubmit = (data: any) => {
        createFaqMutation.mutate(data, {
            onSuccess: () => {
                navigate("/admin/faqs");
            },
        });
    };

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
                        Create New FAQ
                    </h2>
                </div>
                <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
                    Add a new question and answer entry to your FAQ knowledgebase.
                </p>
            </div>

            {/* FAQ Form Card */}
            <div className="bg-white dark:bg-[#162D32] rounded-2xl p-6 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs">
                <FaqForm
                    isLoading={createFaqMutation.isPending}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/admin/faqs")}
                />
            </div>
        </div>
    );
};
