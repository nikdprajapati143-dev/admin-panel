import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit3, HelpCircle, Loader2, Calendar } from "lucide-react";
import { PERMISSIONS } from "../../constants/permissions.js";
import { useFaq } from "../../hooks/useFaqs.js";
import { usePermission } from "../../hooks/usePermission.js";

export const FaqDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { hasPermission } = usePermission();

    const { data: faqRes, isLoading } = useFaq(id || "");
    const faq = faqRes?.data;

    if (isLoading) {
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

    const isActive = faq.status === "ACTIVE";

    return (
        <div className="w-full space-y-6">
            {/* Top Navigation & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                            FAQ Details
                        </h2>
                    </div>
                </div>

                {hasPermission(PERMISSIONS.FAQ_EDIT) && (
                    <button
                        onClick={() => navigate(`/admin/faqs/${id}/edit`)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] text-white text-xs font-semibold shadow-md transition cursor-pointer shrink-0"
                    >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit FAQ</span>
                    </button>
                )}
            </div>

            {/* Detail Card */}
            <div className="bg-white dark:bg-[#162D32] rounded-2xl p-6 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs space-y-6">
                {/* Meta Badge Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D8] dark:border-[#254C54] pb-4">
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                isActive
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            }`}
                        >
                            {isActive ? "ACTIVE (Published)" : "INACTIVE (Draft)"}
                        </span>
                    </div>

                    <div className="text-xs text-[#64748B] dark:text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Created: {faq.createdAt ? new Date(faq.createdAt).toLocaleDateString() : "N/A"}</span>
                    </div>
                </div>

                {/* Question Section */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-1.5">
                        Question
                    </h3>
                    <p className="text-lg font-bold text-[#1E293B] dark:text-white leading-snug">
                        {faq.question}
                    </p>
                </div>

                {/* Answer Section */}
                <div className="bg-[#F7F5F0] dark:bg-[#122529] p-5 rounded-2xl border border-[#E5E0D8] dark:border-[#254C54]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-2">
                        Answer
                    </h3>
                    <p className="text-sm text-[#1E293B] dark:text-slate-200 whitespace-pre-line leading-relaxed">
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    );
};
