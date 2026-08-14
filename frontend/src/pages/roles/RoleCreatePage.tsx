import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";
import { RoleForm } from "../../components/roles/RoleForm.js";
import { useCreateRole } from "../../hooks/useRoles.js";
import type { RoleFormData } from "../../schemas/role.schema.js";

export const RoleCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const createMutation = useCreateRole();

    const handleFormSubmit = (data: RoleFormData) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                navigate("/admin/roles");
            },
        });
    };

    const handleCancel = () => {
        navigate("/admin/roles");
    };

    return (
        <div className="w-full space-y-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-[#64748B] dark:text-slate-400">
                <Link to="/admin/roles" className="hover:text-[#164E50] dark:hover:text-teal-300 transition">
                    Roles
                </Link>
                <span>/</span>
                <span className="font-semibold text-[#1E293B] dark:text-white">Create Role</span>
            </nav>

            {/* Page Header with Back Button */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8] dark:border-[#254C54]">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCancel}
                        className="p-2 rounded-xl border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-[#164E50] dark:hover:text-teal-300 transition shadow-2xs cursor-pointer"
                        title="Back to Roles"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#164E50]/10 dark:bg-[#164E50]/30 flex items-center justify-center text-[#164E50] dark:text-teal-300">
                                <Shield className="w-3.5 h-3.5" />
                            </div>
                            <h2 className="font-serif-title text-2xl font-bold text-[#1E293B] dark:text-white">
                                Create New Role
                            </h2>
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                            Define access privileges and permissions matrix.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Section Card */}
            <div className="bg-white dark:bg-[#162D32] rounded-2xl p-6 sm:p-8 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs">
                <RoleForm
                    isLoading={createMutation.isPending}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
};
