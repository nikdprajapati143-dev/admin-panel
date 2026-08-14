import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../api/client.js";
import { AdminForm } from "../../components/admins/AdminForm.js";
import { useAdmin, useUpdateAdmin } from "../../hooks/useAdmins.js";
import type { ApiResponse, RoleInfo } from "../../types/auth.js";

export const AdminEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch Target Admin details using custom query hook
    const {
        data: adminResponse,
        isLoading: isLoadingAdmin,
        isError,
        error,
    } = useAdmin(id);

    // Fetch Roles for dropdown
    const { data: rolesResponse, isLoading: isLoadingRoles } = useQuery({
        queryKey: ["roles-list"],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<RoleInfo[]>>("/admin/roles?limit=100");
            return res.data;
        },
    });

    const adminData = adminResponse?.data;
    const rolesList = rolesResponse?.data || [];

    // Custom Update Admin Mutation Hook
    const updateMutation = useUpdateAdmin();

    const handleFormSubmit = (formData: FormData) => {
        if (!id) return;
        updateMutation.mutate(
            { id, data: formData },
            {
                onSuccess: () => {
                    navigate("/admin/admins");
                },
            },
        );
    };

    const handleCancel = () => {
        navigate("/admin/admins");
    };

    const isLoading = isLoadingAdmin || isLoadingRoles;

    return (
        <div className="w-full space-y-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-[#64748B] dark:text-slate-400">
                <Link to="/admin/admins" className="hover:text-[#164E50] dark:hover:text-teal-300 transition">
                    Admins
                </Link>
                <span>/</span>
                <span className="font-semibold text-[#1E293B] dark:text-white">Edit Administrator</span>
            </nav>

            {/* Page Header with Back Button */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8] dark:border-[#254C54]">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCancel}
                        className="p-2 rounded-xl border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-[#164E50] dark:hover:text-teal-300 transition shadow-2xs cursor-pointer"
                        title="Back to Admins"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#164E50]/10 dark:bg-[#164E50]/30 flex items-center justify-center text-[#164E50] dark:text-teal-300">
                                <Users className="w-3.5 h-3.5" />
                            </div>
                            <h2 className="font-serif-title text-2xl font-bold text-[#1E293B] dark:text-white">
                                Edit Administrator
                            </h2>
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                            Update administrator details, role permissions, or status.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Section Card */}
            <div className="bg-white dark:bg-[#162D32] rounded-2xl p-6 sm:p-8 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs">
                {isLoading ? (
                    <div className="py-12 text-center text-xs text-[#64748B] dark:text-slate-400 flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#164E50] dark:text-teal-400" />
                        <span>Loading administrator details...</span>
                    </div>
                ) : isError ? (
                    <div className="py-12 text-center text-xs text-red-500 flex flex-col items-center gap-2">
                        <AlertCircle className="w-6 h-6" />
                        <span>{(error as any)?.response?.data?.message || "Failed to load administrator details"}</span>
                        <button
                            onClick={handleCancel}
                            className="mt-2 px-4 py-2 rounded-full border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-[#1E293B] dark:text-white hover:bg-slate-50 text-xs font-semibold"
                        >
                            Return to Admins List
                        </button>
                    </div>
                ) : (
                    <AdminForm
                        initialData={adminData}
                        roles={rolesList}
                        isLoading={updateMutation.isPending}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancel}
                    />
                )}
            </div>
        </div>
    );
};
