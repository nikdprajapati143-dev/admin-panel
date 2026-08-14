import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
    Shield,
    Search,
    Plus,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../api/client.js";
import { DeleteConfirmModal } from "../../components/common/DeleteConfirmModal.js";
import { PermissionGuard } from "../../components/PermissionGuard.js";
import { PERMISSIONS } from "../../constants/permissions.js";
import { usePermission } from "../../hooks/usePermission.js";
import type { ApiResponse, RoleInfo } from "../../types/auth.js";

export const RoleListPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { hasPermission } = usePermission();

    const canEditRole = hasPermission(PERMISSIONS.ROLE_EDIT);
    const canDeleteRole = hasPermission(PERMISSIONS.ROLE_DELETE);
    const hasAnyRoleAction = canEditRole || canDeleteRole;

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Sorting State
    const [sortField, setSortField] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);

    // Fetch Roles List
    const { data: rolesResponse, isLoading, isError, error } = useQuery({
        queryKey: ["roles", page, limit, search],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<RoleInfo[]>>(
                `/admin/roles?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
            );
            return res.data;
        },
    });

    const rolesList = rolesResponse?.data || [];
    const meta = rolesResponse?.meta;

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
    const sortedRoles = useMemo(() => {
        const indexed = rolesList.map((role, idx) => ({ ...role, srNo: (page - 1) * limit + idx + 1 }));
        return indexed.sort((a: any, b: any) => {
            let valA = a[sortField];
            let valB = b[sortField];

            if (sortField === "srNo") {
                valA = a.srNo;
                valB = b.srNo;
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
    }, [rolesList, sortField, sortOrder, page, limit]);

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

    // Delete Role Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await apiClient.delete<ApiResponse>(`/admin/roles/${id}`);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Role soft-deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            queryClient.invalidateQueries({ queryKey: ["roles-list"] });
            setIsDeleteOpen(false);
            setDeletingRoleId(null);
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to delete role";
            toast.error(msg);
        },
    });

    const handleConfirmDelete = () => {
        if (deletingRoleId) {
            deleteMutation.mutate(deletingRoleId);
        }
    };

    return (
        <div className="space-y-4">
            {/* Breadcrumb Header matching Reference Image 2 */}
            <nav className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-slate-400 font-medium">
                <span>Roles</span>
                <span>&gt;</span>
                <span className="font-bold text-[#1E293B] dark:text-white">List</span>
            </nav>

            {/* Title Header with Add Button */}
            <div className="flex items-center justify-between gap-4 pb-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#164E50]/10 dark:bg-[#164E50]/30 flex items-center justify-center text-[#164E50] dark:text-teal-300">
                        <Shield className="w-4 h-4" />
                    </div>
                    <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white">
                        Role Management
                    </h2>
                </div>

                <PermissionGuard permission={PERMISSIONS.ROLE_CREATE}>
                    <Link
                        to="/admin/roles/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] text-white font-semibold text-xs transition shadow-md w-fit cursor-pointer shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Role</span>
                    </Link>
                </PermissionGuard>
            </div>

            {/* SINGLE UNIFIED WHITE CARD (Matching Image 2 Reference EXACTLY) */}
            <div className="bg-white dark:bg-[#162D32] rounded-2xl border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs overflow-hidden">
                {/* Search Bar Top Header inside Card */}
                <div className="p-4 border-b border-[#E5E0D8]/60 dark:border-[#254C54]">
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by role name..."
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
                        <span>Loading roles...</span>
                    </div>
                ) : isError ? (
                    <div className="p-8 text-center text-xs text-red-500 flex flex-col items-center gap-2">
                        <AlertCircle className="w-6 h-6" />
                        <span>{(error as any)?.response?.data?.message || "Failed to load roles"}</span>
                    </div>
                ) : sortedRoles.length === 0 ? (
                    <div className="p-12 text-center text-xs text-[#64748B] dark:text-slate-400 space-y-2">
                        <Shield className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                        <p className="font-bold text-slate-700 dark:text-slate-300">No Roles Found</p>
                        <p>Try adjusting your search query or create a new role.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-center text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-[#E5E0D8] dark:border-[#254C54] bg-[#F7F5F0]/60 dark:bg-[#122529] text-[#64748B] dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
                                    {renderSortHeader("SR NO", "srNo", "py-3.5 px-4 text-center w-16")}
                                    {renderSortHeader("ROLE NAME", "name")}
                                    {renderSortHeader("CREATED", "createdAt")}
                                    {hasAnyRoleAction && <th className="py-3.5 px-5 text-center">ACTIONS</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E0D8]/60 dark:divide-[#254C54] text-[#1E293B] dark:text-slate-200">
                                {sortedRoles.map((role) => {
                                    const roleId = role.id || role._id;
                                    const isSystemRole = ["SUPER_ADMIN", "SUB_ADMIN"].includes(role.name);

                                    return (
                                        <tr key={roleId} className="hover:bg-[#F7F5F0]/40 dark:hover:bg-[#122529]/60 transition">
                                            {/* SR NO */}
                                            <td className="py-3.5 px-4 text-center font-mono font-medium text-[#64748B] dark:text-slate-400">
                                                {role.srNo}
                                            </td>

                                            {/* ROLE NAME */}
                                            <td className="py-3.5 px-5 text-center font-bold">
                                                <div className="inline-flex items-center gap-2 justify-center">
                                                    <Shield className="w-4 h-4 text-[#164E50] dark:text-teal-400 shrink-0" />
                                                    <span className="dark:text-white">{role.name}</span>
                                                    {isSystemRole && (
                                                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[9px] font-bold">
                                                            SYSTEM
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* CREATED */}
                                            <td className="py-3.5 px-5 text-center text-[#64748B] dark:text-slate-400 text-[11px]">
                                                {role.createdAt
                                                    ? new Date(role.createdAt).toLocaleDateString("en-US", {
                                                          month: "short",
                                                          day: "numeric",
                                                          year: "numeric",
                                                      })
                                                    : "N/A"}
                                            </td>

                                            {/* ACTIONS */}
                                            {hasAnyRoleAction && (
                                                <td className="py-3.5 px-5 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <PermissionGuard permission={PERMISSIONS.ROLE_EDIT}>
                                                            <button
                                                                onClick={() => navigate(`/admin/roles/${roleId}/edit`)}
                                                                className="p-1.5 rounded-lg border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-[#164E50] dark:hover:text-teal-300 hover:border-[#164E50] transition shadow-2xs cursor-pointer"
                                                                title="Edit Role Permissions"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </PermissionGuard>

                                                        <PermissionGuard permission={PERMISSIONS.ROLE_DELETE}>
                                                            <button
                                                                onClick={() => {
                                                                    setDeletingRoleId(roleId);
                                                                    setIsDeleteOpen(true);
                                                                }}
                                                                disabled={isSystemRole}
                                                                className="p-1.5 rounded-lg border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 disabled:opacity-30 disabled:hover:text-slate-600 transition shadow-2xs cursor-pointer"
                                                                title={isSystemRole ? "System role cannot be deleted" : "Delete Role"}
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

                {/* Pagination Footer (Matching Reference Screenshot EXACTLY) */}
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
                title="Soft-Delete Role"
                description="Are you sure you want to soft-delete this custom role? Administrators currently assigned to this role will lose their permission attributes."
                confirmText="Soft-Delete Role"
                isLoading={deleteMutation.isPending}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setDeletingRoleId(null);
                }}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};
