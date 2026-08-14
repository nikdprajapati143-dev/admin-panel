import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
    UserCheck,
    Search,
    Plus,
    Edit2,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    Filter,
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
import type { ApiResponse } from "../../types/auth.js";

export const CustomerListPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { hasPermission } = usePermission();

    const canViewCustomer = hasPermission(PERMISSIONS.CUSTOMER_VIEW);
    const canEditCustomer = hasPermission(PERMISSIONS.CUSTOMER_EDIT);
    const canDeleteCustomer = hasPermission(PERMISSIONS.CUSTOMER_DELETE);
    const hasAnyCustomerAction = canViewCustomer || canEditCustomer || canDeleteCustomer;

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Sorting State
    const [sortField, setSortField] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

    // Fetch Customers List
    const { data: customersResponse, isLoading, isError, error } = useQuery({
        queryKey: ["customers", page, limit, search, statusFilter],
        queryFn: async () => {
            let url = `/admin/customers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
            if (statusFilter !== "ALL") {
                url += `&status=${statusFilter}`;
            }
            const res = await apiClient.get<ApiResponse<any[]>>(url);
            return res.data;
        },
    });

    const customersList = customersResponse?.data || [];
    const meta = customersResponse?.meta;

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
    const sortedCustomers = useMemo(() => {
        const indexed = customersList.map((cust, idx) => ({ ...cust, srNo: (page - 1) * limit + idx + 1 }));
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
    }, [customersList, sortField, sortOrder, page, limit]);

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

    // Direct Toggle Customer Status Mutation calling dedicated PATCH /admin/customers/:id/status API
    const toggleStatusMutation = useMutation({
        mutationFn: async ({ id, newStatus }: { id: string; newStatus: "ACTIVE" | "INACTIVE" }) => {
            const res = await apiClient.patch<ApiResponse>(`/admin/customers/${id}/status`, {
                status: newStatus,
            });
            return res.data;
        },
        onSuccess: (_, variables) => {
            if (variables.newStatus === "ACTIVE") {
                toast.success("Customer Activated successfully!");
            } else {
                toast.success("Customer Deactivated successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to update customer status";
            toast.error(msg);
        },
    });

    // Delete Customer Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await apiClient.delete<ApiResponse>(`/admin/customers/${id}`);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Customer deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            setIsDeleteOpen(false);
            setDeletingCustomerId(null);
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to delete customer";
            toast.error(msg);
        },
    });

    const handleConfirmDelete = () => {
        if (deletingCustomerId) {
            deleteMutation.mutate(deletingCustomerId);
        }
    };

    return (
        <div className="space-y-4">
            {/* Breadcrumb Header */}
            <nav className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-slate-400 font-medium">
                <span>Customers</span>
                <span>&gt;</span>
                <span className="font-bold text-[#1E293B] dark:text-white">List</span>
            </nav>

            {/* Title Header with Add Button */}
            <div className="flex items-center justify-between gap-4 pb-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#164E50]/10 dark:bg-[#164E50]/30 flex items-center justify-center text-[#164E50] dark:text-teal-300">
                        <UserCheck className="w-4 h-4" />
                    </div>
                    <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white">
                        Customer Management
                    </h2>
                </div>

                <PermissionGuard permission={PERMISSIONS.CUSTOMER_CREATE}>
                    <Link
                        to="/admin/customers/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] text-white font-semibold text-xs transition shadow-md w-fit cursor-pointer shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Customer</span>
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
                            placeholder="Search by name, email, phone..."
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

                {/* Table Data Section */}
                {isLoading ? (
                    <div className="p-12 text-center text-xs text-[#64748B] dark:text-slate-400 flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#164E50] dark:text-teal-400" />
                        <span>Loading customers...</span>
                    </div>
                ) : isError ? (
                    <div className="p-8 text-center text-xs text-red-500 flex flex-col items-center gap-2">
                        <AlertCircle className="w-6 h-6" />
                        <span>{(error as any)?.response?.data?.message || "Failed to load customers"}</span>
                    </div>
                ) : sortedCustomers.length === 0 ? (
                    <div className="p-12 text-center text-xs text-[#64748B] dark:text-slate-400 space-y-2">
                        <UserCheck className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                        <p className="font-bold text-slate-700 dark:text-slate-300">No Customers Found</p>
                        <p>Try adjusting your search criteria or register a new customer.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-center text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-[#E5E0D8] dark:border-[#254C54] bg-[#F7F5F0]/60 dark:bg-[#122529] text-[#64748B] dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
                                    {renderSortHeader("SR NO", "srNo", "py-3.5 px-4 text-center w-16")}
                                    {renderSortHeader("FIRST NAME", "firstName")}
                                    {renderSortHeader("LAST NAME", "lastName")}
                                    {renderSortHeader("EMAIL", "email")}
                                    {renderSortHeader("PHONE NUMBER", "phone")}
                                    {renderSortHeader("CREATED", "createdAt")}
                                    <th className="py-3.5 px-5 text-center">STATUS</th>
                                    {hasAnyCustomerAction && <th className="py-3.5 px-5 text-center">ACTIONS</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E0D8]/60 dark:divide-[#254C54] text-[#1E293B] dark:text-slate-200">
                                {sortedCustomers.map((cust) => {
                                    const customerId = cust._id || cust.id;
                                    const isCurrentActive = cust.status === "ACTIVE";

                                    return (
                                        <tr key={customerId} className="hover:bg-[#F7F5F0]/40 dark:hover:bg-[#122529]/60 transition">
                                            {/* SR NO */}
                                            <td className="py-3.5 px-4 text-center font-mono font-medium text-[#64748B] dark:text-slate-400">
                                                {cust.srNo}
                                            </td>

                                            {/* FIRST NAME */}
                                            <td className="py-3.5 px-5 text-center font-bold text-[#1E293B] dark:text-white">
                                                {cust.firstName}
                                            </td>

                                            {/* LAST NAME */}
                                            <td className="py-3.5 px-5 text-center font-bold text-[#1E293B] dark:text-white">
                                                {cust.lastName}
                                            </td>

                                            {/* EMAIL */}
                                            <td className="py-3.5 px-5 text-center text-[#64748B] dark:text-slate-300 text-[11px] font-mono">
                                                {cust.email}
                                            </td>

                                            {/* PHONE NUMBER */}
                                            <td className="py-3.5 px-5 text-center font-mono text-[11px]">
                                                <span className="font-bold text-[#164E50] dark:text-teal-300">{cust.countryCode || "+965"}</span>{" "}
                                                <span className="dark:text-slate-200">{cust.phone}</span>
                                            </td>

                                            {/* CREATED */}
                                            <td className="py-3.5 px-5 text-center text-[#64748B] dark:text-slate-400 text-[11px]">
                                                {cust.createdAt
                                                    ? new Date(cust.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })
                                                    : "N/A"}
                                            </td>

                                            {/* STATUS Toggle Switch */}
                                            <td className="py-3.5 px-5 text-center">
                                                <button
                                                    onClick={() =>
                                                        toggleStatusMutation.mutate({
                                                            id: customerId,
                                                            newStatus: isCurrentActive ? "INACTIVE" : "ACTIVE",
                                                        })
                                                    }
                                                    disabled={toggleStatusMutation.isPending}
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
                                            {hasAnyCustomerAction && (
                                                <td className="py-3.5 px-5 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <PermissionGuard permission={PERMISSIONS.CUSTOMER_VIEW}>
                                                            <button
                                                                onClick={() => navigate(`/admin/customers/${customerId}`)}
                                                                className="p-1.5 rounded-lg border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-[#164E50] dark:hover:text-teal-300 hover:border-[#164E50] transition shadow-2xs cursor-pointer"
                                                                title="View Customer Profile"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>
                                                        </PermissionGuard>

                                                        <PermissionGuard permission={PERMISSIONS.CUSTOMER_EDIT}>
                                                            <button
                                                                onClick={() => navigate(`/admin/customers/${customerId}/edit`)}
                                                                className="p-1.5 rounded-lg border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-[#164E50] dark:hover:text-teal-300 hover:border-[#164E50] transition shadow-2xs cursor-pointer"
                                                                title="Edit Customer"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </PermissionGuard>

                                                        <PermissionGuard permission={PERMISSIONS.CUSTOMER_DELETE}>
                                                            <button
                                                                onClick={() => {
                                                                    setDeletingCustomerId(customerId);
                                                                    setIsDeleteOpen(true);
                                                                }}
                                                                className="p-1.5 rounded-lg border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 transition shadow-2xs cursor-pointer"
                                                                title="Delete Customer"
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
                title="Delete Customer"
                description="Are you sure you want to delete this customer record? The customer profile will be archived."
                confirmText="Delete Customer"
                isLoading={deleteMutation.isPending}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setDeletingCustomerId(null);
                }}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};
