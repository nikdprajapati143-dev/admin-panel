import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    HelpCircle,
    Search,
    Plus,
    Edit2,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Filter,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { DeleteConfirmModal } from "../../components/common/DeleteConfirmModal.js";
import { PermissionGuard } from "../../components/PermissionGuard.js";
import { PERMISSIONS } from "../../constants/permissions.js";
import { usePermission } from "../../hooks/usePermission.js";
import { useFaqs, useUpdateFaqStatus, useDeleteFaq } from "../../hooks/useFaqs.js";
import type { FaqItem } from "../../types/faq.types.js";

export const FaqListPage: React.FC = () => {
    const navigate = useNavigate();
    const { hasPermission } = usePermission();

    const canViewFaq = hasPermission(PERMISSIONS.FAQ_VIEW);
    const canEditFaq = hasPermission(PERMISSIONS.FAQ_EDIT);
    const canDeleteFaq = hasPermission(PERMISSIONS.FAQ_DELETE);
    const hasAnyFaqAction = canViewFaq || canEditFaq || canDeleteFaq;

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Sorting State
    const [sortField, setSortField] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingFaqId, setDeletingFaqId] = useState<string | null>(null);

    // Fetch FAQs List via custom hook
    const { data: faqsResponse, isLoading } = useFaqs({
        page,
        limit,
        search,
        status: statusFilter,
    });

    const toggleStatusMutation = useUpdateFaqStatus();
    const deleteMutation = useDeleteFaq();

    const faqsList: FaqItem[] = faqsResponse?.data || [];
    const meta = faqsResponse?.meta;

    // Sorting Handler
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    // Client-side Sorted List (including srNo)
    const sortedFaqs = useMemo(() => {
        const indexed = faqsList.map((faq, idx) => ({ ...faq, srNo: (page - 1) * limit + idx + 1 }));
        return indexed.sort((a: any, b: any) => {
            let valA = a[sortField];
            let valB = b[sortField];

            if (sortField === "srNo") {
                valA = a.srNo;
                valB = b.srNo;
            } else if (sortField === "createdAt") {
                valA = new Date(valA || 0).getTime();
                valB = new Date(valB || 0).getTime();
            } else if (sortField === "sortOrder") {
                valA = Number(valA || 0);
                valB = Number(valB || 0);
            } else if (typeof valA === "string") {
                valA = valA.toLowerCase();
                valB = (valB || "").toString().toLowerCase();
            }

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [faqsList, sortField, sortOrder, page, limit]);

    const renderSortHeader = (label: string, field: string, className = "py-3.5 px-5 text-center") => {
        const isActive = sortField === field;
        return (
            <th
                onClick={() => handleSort(field)}
                className={`${className} cursor-pointer hover:text-[#164E50] dark:hover:text-teal-300 transition select-none`}
            >
                <div className="inline-flex items-center gap-1.5 justify-center">
                    <span>{label}</span>
                    {isActive ? (
                        sortOrder === "asc" ? (
                            <ArrowUp className="w-3 h-3 text-[#164E50] dark:text-teal-300" />
                        ) : (
                            <ArrowDown className="w-3 h-3 text-[#164E50] dark:text-teal-300" />
                        )
                    ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                    )}
                </div>
            </th>
        );
    };

    const handleConfirmDelete = () => {
        if (!deletingFaqId) return;

        deleteMutation.mutate(deletingFaqId, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingFaqId(null);
            },
        });
    };

    const handleToggleStatus = (faqId: string, currentStatus: string) => {
        const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        toggleStatusMutation.mutate({ id: faqId, newStatus });
    };

    return (
        <div className="space-y-4">
            {/* Breadcrumb Header */}
            <nav className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-slate-400 font-medium">
                <span>FAQs</span>
                <span>&gt;</span>
                <span className="font-bold text-[#1E293B] dark:text-white">List</span>
            </nav>

            {/* Title Header with Add Button */}
            <div className="flex items-center justify-between gap-4 pb-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#164E50]/10 dark:bg-[#164E50]/30 flex items-center justify-center text-[#164E50] dark:text-teal-300">
                        <HelpCircle className="w-4 h-4" />
                    </div>
                    <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white">
                        FAQ Management
                    </h2>
                </div>

                <PermissionGuard permission={PERMISSIONS.FAQ_CREATE}>
                    <Link
                        to="/admin/faqs/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] text-white font-semibold text-xs transition shadow-md w-fit cursor-pointer shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create FAQ</span>
                    </Link>
                </PermissionGuard>
            </div>

            {/* SINGLE UNIFIED WHITE CARD */}
            <div className="bg-white dark:bg-[#162D32] rounded-2xl border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs overflow-hidden">
                {/* Search Bar & Filter Header inside Card */}
                <div className="p-4 border-b border-[#E5E0D8]/60 dark:border-[#254C54] flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by question, answer..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 bg-[#F7F5F0]/50 dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400 hidden sm:inline" />
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="w-full sm:w-40 px-3 py-2 bg-[#F7F5F0]/50 dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition cursor-pointer"
                        >
                            <option value="ALL" className="bg-white dark:bg-[#122529] text-[#1E293B] dark:text-white">All Status</option>
                            <option value="ACTIVE" className="bg-white dark:bg-[#122529] text-[#1E293B] dark:text-white">ACTIVE</option>
                            <option value="INACTIVE" className="bg-white dark:bg-[#122529] text-[#1E293B] dark:text-white">INACTIVE</option>
                        </select>
                    </div>
                </div>

                {/* Table Section */}
                {isLoading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-[#64748B] dark:text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin text-[#164E50] dark:text-teal-400 mb-2" />
                        <p className="text-xs font-medium">Loading FAQs...</p>
                    </div>
                ) : sortedFaqs.length === 0 ? (
                    <div className="p-12 text-center text-[#64748B] dark:text-slate-400">
                        <HelpCircle className="w-10 h-10 mx-auto text-[#64748B]/40 mb-3" />
                        <p className="font-semibold text-sm text-[#1E293B] dark:text-slate-200">No FAQs Found</p>
                        <p className="text-xs mt-1">Try adjusting your search criteria or create a new FAQ entry.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-[#F7F5F0]/60 dark:bg-[#122529] border-b border-[#E5E0D8] dark:border-[#254C54] text-[#64748B] dark:text-slate-400 uppercase tracking-wider font-bold">
                                    {renderSortHeader("SR NO", "srNo", "py-3.5 px-4 text-center")}
                                    {renderSortHeader("QUESTION", "question", "py-3.5 px-5 text-left")}
                                    {renderSortHeader("ANSWER", "answer", "py-3.5 px-5 text-left")}
                                    {renderSortHeader("SORT ORDER", "sortOrder", "py-3.5 px-5 text-center")}
                                    {renderSortHeader("CREATED", "createdAt", "py-3.5 px-5 text-center")}
                                    <th className="py-3.5 px-5 text-center">STATUS</th>
                                    {hasAnyFaqAction && <th className="py-3.5 px-5 text-center">ACTIONS</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E0D8]/60 dark:divide-[#254C54] text-[#1E293B] dark:text-slate-200">
                                {sortedFaqs.map((faq) => {
                                    const faqId = faq._id || faq.id;
                                    const isCurrentActive = faq.status === "ACTIVE";

                                    return (
                                        <tr key={faqId} className="hover:bg-[#F7F5F0]/40 dark:hover:bg-[#122529]/60 transition">
                                            {/* SR NO */}
                                            <td className="py-3.5 px-4 text-center font-mono font-medium text-[#64748B] dark:text-slate-400">
                                                {faq.srNo}
                                            </td>

                                            {/* QUESTION */}
                                            <td className="py-3.5 px-5 font-bold text-[#1E293B] dark:text-white max-w-xs">
                                                <div className="line-clamp-2">{faq.question}</div>
                                            </td>

                                            {/* ANSWER */}
                                            <td className="py-3.5 px-5 text-[#64748B] dark:text-slate-300 text-[11px] max-w-sm">
                                                <div className="line-clamp-2">{faq.answer}</div>
                                            </td>

                                            {/* SORT ORDER */}
                                            <td className="py-3.5 px-5 text-center font-mono font-bold text-[#164E50] dark:text-teal-300 text-xs">
                                                {faq.sortOrder ?? 1}
                                            </td>

                                            {/* CREATED */}
                                            <td className="py-3.5 px-5 text-center text-[#64748B] dark:text-slate-400 text-[11px]">
                                                {faq.createdAt
                                                    ? new Date(faq.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })
                                                    : "N/A"}
                                            </td>

                                            {/* STATUS Toggle Switch */}
                                            <td className="py-3.5 px-5 text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(faqId, faq.status)}
                                                    disabled={!canEditFaq || toggleStatusMutation.isPending}
                                                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer mx-auto ${isCurrentActive
                                                        ? "bg-[#164E50] dark:bg-teal-500 justify-end"
                                                        : "bg-slate-300 dark:bg-slate-700 justify-start"
                                                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                                                    title={`Click to turn ${isCurrentActive ? "OFF" : "ON"}`}
                                                >
                                                    <span className="bg-white w-4 h-4 rounded-full shadow-md transition-transform" />
                                                </button>
                                            </td>

                                            {/* ACTIONS */}
                                            {hasAnyFaqAction && (
                                                <td className="py-3.5 px-5 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <PermissionGuard permission={PERMISSIONS.FAQ_VIEW}>
                                                            <button
                                                                onClick={() => navigate(`/admin/faqs/${faqId}`)}
                                                                className="p-1.5 rounded-lg border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-[#164E50] dark:hover:text-teal-300 hover:border-[#164E50] transition shadow-2xs cursor-pointer"
                                                                title="View FAQ Details"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>
                                                        </PermissionGuard>

                                                        <PermissionGuard permission={PERMISSIONS.FAQ_EDIT}>
                                                            <button
                                                                onClick={() => navigate(`/admin/faqs/${faqId}/edit`)}
                                                                className="p-1.5 rounded-lg border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-[#164E50] dark:hover:text-teal-300 hover:border-[#164E50] transition shadow-2xs cursor-pointer"
                                                                title="Edit FAQ"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </PermissionGuard>

                                                        <PermissionGuard permission={PERMISSIONS.FAQ_DELETE}>
                                                            <button
                                                                onClick={() => {
                                                                    setDeletingFaqId(faqId);
                                                                    setIsDeleteOpen(true);
                                                                }}
                                                                className="p-1.5 rounded-lg border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 transition shadow-2xs cursor-pointer"
                                                                title="Delete FAQ"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </PermissionGuard>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Footer */}
                <div className="p-4 border-t border-[#E5E0D8] dark:border-[#254C54] bg-[#F7F5F0]/30 dark:bg-[#122529]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Left: Show Entries & Count */}
                    <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                            <span>Show</span>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="px-2 py-1 bg-white dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] rounded-lg text-xs font-bold text-[#1E293B] dark:text-white outline-hidden cursor-pointer"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>entries</span>
                        </div>
                        <span>•</span>
                        <span>
                            Showing {meta?.totalDocs ? (page - 1) * limit + 1 : 0}–
                            {Math.min(page * limit, meta?.totalDocs || 0)} of {meta?.totalDocs || 0}
                        </span>
                    </div>

                    {/* Right: < Page [1] of X > Controls */}
                    <div className="flex items-center gap-2 text-xs">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page <= 1}
                            className="p-1.5 rounded-lg border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 disabled:opacity-40 transition cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <span className="text-[#64748B] dark:text-slate-400 font-medium">Page</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#164E50] text-white text-xs font-bold shadow-2xs">
                            {page}
                        </span>
                        <span className="text-[#64748B] dark:text-slate-400 font-medium">
                            of {meta?.totalPages || 1}
                        </span>

                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, meta?.totalPages || 1))}
                            disabled={page >= (meta?.totalPages || 1)}
                            className="p-1.5 rounded-lg border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 disabled:opacity-40 transition cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                title="Delete FAQ"
                description="Are you sure you want to delete this FAQ entry? The question will be permanently removed from the system."
                confirmText="Delete FAQ"
                isLoading={deleteMutation.isPending}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setDeletingFaqId(null);
                }}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};
