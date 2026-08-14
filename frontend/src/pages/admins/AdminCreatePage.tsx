import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../api/client.js";
import { AdminForm } from "../../components/admins/AdminForm.js";
import { useCreateAdmin } from "../../hooks/useAdmins.js";
import type { ApiResponse, RoleInfo } from "../../types/auth.js";

export const AdminCreatePage: React.FC = () => {
    const navigate = useNavigate();

    // Fetch Roles for dropdown
    const { data: rolesResponse, isLoading: isLoadingRoles } = useQuery({
        queryKey: ["roles-list"],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<RoleInfo[]>>("/admin/roles?limit=100");
            return res.data;
        },
    });

    const rolesList = rolesResponse?.data || [];

    // Create Admin Mutation Hook
    const createMutation = useCreateAdmin();

    const handleFormSubmit = (formData: FormData) => {
        createMutation.mutate(formData, {
            onSuccess: () => {
                navigate("/admin/admins");
            },
        });
    };

    const handleCancel = () => {
        navigate("/admin/admins");
    };

    return (
        <div className="w-full space-y-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-[#64748B] dark:text-slate-400">
                <Link to="/admin/admins" className="hover:text-[#164E50] dark:hover:text-teal-300 transition">
                    Admins
                </Link>
                <span>/</span>
                <span className="font-semibold text-[#1E293B] dark:text-white">Create Administrator</span>
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
                                Create Administrator
                            </h2>
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                            Fill out the details below to create a new system admin account.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Section Card */}
            <div className="bg-white dark:bg-[#162D32] rounded-2xl p-6 sm:p-8 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs">
                {isLoadingRoles ? (
                    <div className="py-12 text-center text-xs text-[#64748B] dark:text-slate-400 flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#164E50] dark:text-teal-400" />
                        <span>Loading role definitions...</span>
                    </div>
                ) : (
                    <AdminForm
                        roles={rolesList}
                        isLoading={createMutation.isPending}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancel}
                    />
                )}
            </div>
        </div>
    );
};
