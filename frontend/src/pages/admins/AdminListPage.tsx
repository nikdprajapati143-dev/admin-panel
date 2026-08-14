import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
    Users,
    Search,
    Plus,
    Edit2,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Shield,
    AlertCircle,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmModal } from "../../components/common/DeleteConfirmModal.js";
import { PermissionGuard } from "../../components/PermissionGuard.js";
import { PERMISSIONS } from "../../constants/permissions.js";
import { useAuthStore } from "../../store/authStore.js";
import { usePermission } from "../../hooks/usePermission.js";
import { useAdmins, useToggleAdminStatus, useDeleteAdmin } from "../../hooks/useAdmins.js";
import { getAvatarUrl } from "../../components/admins/AdminForm.js";
import type { AdminUser } from "../../types/auth.js";

export const AdminListPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { admin: currentAdmin } = useAuthStore();
    const { hasPermission } = usePermission();

    const canViewAdmin = hasPermission(PERMISSIONS.ADMIN_VIEW);
    const canEditAdmin = hasPermission(PERMISSIONS.ADMIN_EDIT);
    const canDeleteAdmin = hasPermission(PERMISSIONS.ADMIN_DELETE);
    const hasAnyAdminAction = canViewAdmin || canEditAdmin || canDeleteAdmin;

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Sorting State
    const [sortField, setSortField] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);

    // Fetch Admins list using custom query hook
    const { data: adminsResponse, isLoading, isError, error } = useAdmins({ page, limit, search });

    const toggleStatusMutation = useToggleAdminStatus();
    const deleteMutation = useDeleteAdmin();

    const responseData = adminsResponse?.data;
    const adminsList: AdminUser[] = Array.isArray(responseData)
        ? responseData
        : (responseData as any)?.admins || [];
    const meta = adminsResponse?.meta || (responseData as any)?.meta;

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
    const sortedAdmins = useMemo(() => {
        const indexed = adminsList.map((adm, idx) => ({ ...adm, srNo: (page - 1) * limit + idx + 1 }));
        return indexed.sort((a: any, b: any) => {
            let valA = a[sortField];
            let valB = b[sortField];

            if (sortField === "srNo") {
                valA = a.srNo;
                valB = b.srNo;
            } else if (sortField === "role") {
                valA = typeof a.role === "object" ? a.role?.name || "" : a.role || "";
                valB = typeof b.role === "object" ? b.role?.name || "" : b.role || "";
            } else if (sortField === "createdAt") {
                valA = new Date(valA || 0).getTime();
                valB = new Date(valB || 0).getTime();
            } else if (typeof valA === "string") {
                valA = valA.toLowerCase();
                valB = (valB || "").toString().toLowerCase();
            }

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [adminsList, sortField, sortOrder, page, limit]);

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
        if (!deletingAdminId) return;
        deleteMutation.mutate(deletingAdminId, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingAdminId(null);
            },
        });
    };

    const handleToggleStatus = (adminId: string, currentStatus: string, isSelf: boolean) => {
        if (isSelf) return;
        const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        toggleStatusMutation.mutate({ id: adminId, newStatus });
    };

    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <div className="space-y-4">
            {/* Breadcrumb Header */}
            <nav className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-slate-400 font-medium">
                <span>Admin Users</span>
                <span>&gt;</span>
                <span className="font-bold text-[#1E293B] dark:text-white">List</span>
            </nav>

            {/* Title Header with Add Button */}
            <div className="flex items-center justify-between gap-4 pb-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#164E50]/10 dark:bg-[#164E50]/30 flex items-center justify-center text-[#164E50] dark:text-teal-300">
                        <Users className="w-4 h-4" />
                    </div>
                    <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white">
                        Admin User Management
                    </h2>
                </div>

                <PermissionGuard permission={PERMISSIONS.ADMIN_CREATE}>
                    <Link
                        to="/admin/admins/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] text-white font-semibold text-xs transition shadow-md w-fit cursor-pointer shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Admin</span>
                    </Link>
                </PermissionGuard>
            </div>

            {/* SINGLE UNIFIED WHITE CARD */}
            <div className="bg-white dark:bg-[#162D32] rounded-2xl border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs overflow-hidden">
                {/* Search Bar Top Header inside Card */}
                <div className="p-4 border-b border-[#E5E0D8]/60 dark:border-[#254C54]">
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search admin users..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 bg-[#F7F5F0]/50 dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition"
                        />
                    </div>
                </div>

                {/* Table Data Section */}
                {isLoading ? (
                    <div className="p-12 text-center text-xs text-[#64748B] dark:text-slate-400 flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#164E50] dark:text-teal-400" />
                        <span>Loading administrators...</span>
                    </div>
                ) : isError ? (
                    <div className="p-8 text-center text-xs text-red-500 flex flex-col items-center gap-2">
                        <AlertCircle className="w-6 h-6" />
                        <span>{(error as any)?.response?.data?.message || "Failed to load admins"}</span>
                    </div>
                ) : sortedAdmins.length === 0 ? (
                    <div className="p-12 text-center text-xs text-[#64748B] dark:text-slate-400 space-y-2">
                        <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                        <p className="font-bold text-slate-700 dark:text-slate-300">No Administrators Found</p>
                        <p>Try adjusting your search criteria or create a new administrator.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-center text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-[#E5E0D8] dark:border-[#254C54] bg-[#F7F5F0]/60 dark:bg-[#122529] text-[#64748B] dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
                                    {renderSortHeader("SR NO", "srNo", "py-3.5 px-4 text-center w-16")}
                                    <th className="py-3.5 px-4 text-center">AVATAR</th>
                                    {renderSortHeader("USER NAME", "name")}
                                    {renderSortHeader("EMAIL", "email")}
                                    {renderSortHeader("ROLE", "role")}
                                    {renderSortHeader("CREATED", "createdAt")}
                                    <th className="py-3.5 px-5 text-center">STATUS</th>
                                    {hasAnyAdminAction && <th className="py-3.5 px-5 text-center">ACTIONS</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E0D8]/60 dark:divide-[#254C54] text-[#1E293B] dark:text-slate-200">
                                {sortedAdmins.map((adm) => {
                                    const adminId = adm.id || adm._id;
                                    const isSelf = currentAdmin?._id === adminId || currentAdmin?.id === adminId;
                                    const roleObj = typeof adm.role === "object" ? adm.role : null;
                                    const roleName = roleObj ? roleObj.name : "Role";
                                    const isCurrentActive = adm.status === "ACTIVE";

                                    return (
                                        <tr key={adminId} className="hover:bg-[#F7F5F0]/40 dark:hover:bg-[#122529]/60 transition">
                                            {/* SR NO */}
                                            <td className="py-3.5 px-4 text-center font-mono font-medium text-[#64748B] dark:text-slate-400">
                                                {adm.srNo}
                                            </td>

                                            {/* Avatar Column */}
                                            <td className="py-3.5 px-4 text-center">
                                                <img
                                                    src={getAvatarUrl(adm.avatar)}
                                                    alt={adm.name}
                                                    className="w-9 h-9 rounded-full object-cover border border-[#E5E0D8] dark:border-[#254C54] mx-auto shrink-0"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = defaultAvatar;
                                                    }}
                                                />
                                            </td>

                                            {/* USER NAME */}
                                            <td className="py-3.5 px-5 text-center font-bold text-[#1E293B] dark:text-white">
                                                <div className="inline-flex items-center gap-1.5 justify-center">
                                                    <span>{adm.name}</span>
                                                    {isSelf && (
                                                        <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[9px] font-bold">
                                                            YOU
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* EMAIL */}
                                            <td className="py-3.5 px-5 text-center text-[#64748B] dark:text-slate-300 text-[11px] font-mono">
                                                {adm.email}
                                            </td>

                                            {/* ROLE */}
                                            <td className="py-3.5 px-5 text-center">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-[#122529] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#254C54]">
                                                    <Shield className="w-3 h-3 text-[#164E50] dark:text-teal-400" />
                                                    <span>{roleName}</span>
                                                </span>
                                            </td>

                                            {/* CREATED */}
                                            <td className="py-3.5 px-5 text-center text-[#64748B] dark:text-slate-400 text-[11px]">
                                                {adm.createdAt
                                                    ? new Date(adm.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })
                                                    : "N/A"}
                                            </td>

                                            {/* STATUS Toggle Switch */}
                                            <td className="py-3.5 px-5 text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(adminId, adm.status, isSelf)}
                                                    disabled={isSelf || toggleStatusMutation.isPending}
                                                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer mx-auto ${isCurrentActive
                                                            ? "bg-[#164E50] dark:bg-teal-500 justify-end"
                                                            : "bg-slate-300 dark:bg-slate-700 justify-start"
                                                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                                                    title={isSelf ? "Cannot change own status" : `Click to turn ${isCurrentActive ? "OFF" : "ON"}`}
                                                >
                                                    <span className="bg-white w-4 h-4 rounded-full shadow-md transition-transform" />
                                                </button>
                                            </td>

                                            {/* ACTIONS */}
                                            {hasAnyAdminAction && (
                                                <td className="py-3.5 px-5 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <PermissionGuard permission={PERMISSIONS.ADMIN_VIEW}>
                                                            <button
                                                                onClick={() => navigate(`/admin/admins/${adminId}`)}
                                                                className="p-1.5 rounded-lg border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-[#164E50] dark:hover:text-teal-300 hover:border-[#164E50] transition shadow-2xs cursor-pointer"
                                                                title="View Admin Details"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>
                                                        </PermissionGuard>

                                                        <PermissionGuard permission={PERMISSIONS.ADMIN_EDIT}>
                                                            <button
                                                                onClick={() => navigate(`/admin/admins/${adminId}/edit`)}
                                                                className="p-1.5 rounded-lg border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-[#164E50] dark:hover:text-teal-300 hover:border-[#164E50] transition shadow-2xs cursor-pointer"
                                                                title="Edit Admin"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </PermissionGuard>

                                                        <PermissionGuard permission={PERMISSIONS.ADMIN_DELETE}>
                                                            <button
                                                                onClick={() => {
                                                                    setDeletingAdminId(adminId);
                                                                    setIsDeleteOpen(true);
                                                                }}
                                                                disabled={isSelf}
                                                                className="p-1.5 rounded-lg border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 disabled:opacity-40 disabled:hover:text-slate-600 transition shadow-2xs cursor-pointer"
                                                                title={isSelf ? "You cannot delete your own account" : "Delete Admin"}
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
                title="Delete Administrator"
                description="Are you sure you want to delete this administrator account? They will no longer be able to log in to the admin panel."
                confirmText="Delete Admin"
                isLoading={deleteMutation.isPending}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setDeletingAdminId(null);
                }}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};
