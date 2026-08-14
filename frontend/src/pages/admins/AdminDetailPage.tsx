import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Shield, Mail, Calendar, Loader2, AlertCircle, Edit2, CheckCircle2 } from "lucide-react";
import { getAvatarUrl } from "../../components/admins/AdminForm.js";
import { useAdmin } from "../../hooks/useAdmins.js";

export const AdminDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch Target Admin details using custom query hook
    const {
        data: adminResponse,
        isLoading,
        isError,
        error,
    } = useAdmin(id);

    const admin = adminResponse?.data;
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    const roleObj = typeof admin?.role === "object" ? admin.role : null;
    const roleName = roleObj ? roleObj.name : "Role";
    const rolePermissions = roleObj && Array.isArray(roleObj.permissions) ? roleObj.permissions : [];

    return (
        <div className="w-full space-y-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-[#64748B] dark:text-slate-400">
                <Link to="/admin/admins" className="hover:text-[#164E50] dark:hover:text-teal-300 transition">
                    Admins
                </Link>
                <span>/</span>
                <span className="font-semibold text-[#1E293B] dark:text-white">Administrator Details</span>
            </nav>

            {/* Page Header with Back & Edit Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8] dark:border-[#254C54]">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/admin/admins")}
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
                                Administrator Details
                            </h2>
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                            View administrator profile, account status, and role permissions.
                        </p>
                    </div>
                </div>

                {admin && (
                    <button
                        onClick={() => navigate(`/admin/admins/${id}/edit`)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] text-white font-semibold text-xs transition shadow-md w-fit cursor-pointer"
                    >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit Administrator</span>
                    </button>
                )}
            </div>

            {/* Detail Card Container */}
            <div className="bg-white dark:bg-[#162D32] rounded-2xl p-6 sm:p-8 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs space-y-6">
                {isLoading ? (
                    <div className="py-12 text-center text-xs text-[#64748B] dark:text-slate-400 flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#164E50] dark:text-teal-400" />
                        <span>Loading administrator profile...</span>
                    </div>
                ) : isError || !admin ? (
                    <div className="py-12 text-center text-xs text-red-500 flex flex-col items-center gap-2">
                        <AlertCircle className="w-6 h-6" />
                        <span>{(error as any)?.response?.data?.message || "Failed to load administrator details"}</span>
                        <button
                            onClick={() => navigate("/admin/admins")}
                            className="mt-2 px-4 py-2 rounded-full border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-[#1E293B] dark:text-white hover:bg-slate-50 text-xs font-semibold"
                        >
                            Return to Admins List
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Profile Overview Header Card */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-[#F7F5F0]/60 dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54]">
                            <img
                                src={getAvatarUrl(admin.avatar)}
                                alt={admin.name}
                                className="w-24 h-24 rounded-full object-cover border-2 border-[#E5E0D8] dark:border-[#254C54] shadow-sm shrink-0"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = defaultAvatar;
                                }}
                            />

                            <div className="space-y-2 text-center sm:text-left flex-1">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <h3 className="font-serif-title text-2xl font-bold text-[#1E293B] dark:text-white">
                                        {admin.name}
                                    </h3>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            admin.status === "ACTIVE"
                                                ? "bg-[#E6F4EA] dark:bg-emerald-950/80 text-[#1E7E34] dark:text-emerald-400 border dark:border-emerald-800/40"
                                                : "bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-400 border dark:border-red-800/40"
                                        }`}
                                    >
                                        {admin.status || "ACTIVE"}
                                    </span>
                                </div>

                                <p className="text-xs text-[#64748B] dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-[#164E50] dark:text-teal-400" />
                                    <span>{admin.email}</span>
                                </p>

                                <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#162D32] border border-[#E5E0D8] dark:border-[#254C54] text-slate-700 dark:text-slate-200 shadow-2xs">
                                        <Shield className="w-3.5 h-3.5 text-[#164E50] dark:text-teal-400" />
                                        <span>Role: {roleName}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Attribute Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                            <div className="p-4 rounded-xl border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529]">
                                <p className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Full Name
                                </p>
                                <p className="text-sm font-bold text-[#1E293B] dark:text-white">{admin.name}</p>
                            </div>

                            <div className="p-4 rounded-xl border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529]">
                                <p className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Email Address
                                </p>
                                <p className="text-sm font-bold text-[#1E293B] dark:text-white">{admin.email}</p>
                            </div>

                            <div className="p-4 rounded-xl border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529]">
                                <p className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Account Status
                                </p>
                                <p className="text-sm font-bold text-[#1E293B] dark:text-white">{admin.status || "ACTIVE"}</p>
                            </div>

                            <div className="p-4 rounded-xl border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529]">
                                <p className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Joined Date
                                </p>
                                <p className="text-sm font-bold text-[#1E293B] dark:text-white flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#164E50] dark:text-teal-400" />
                                    <span>
                                        {admin.createdAt
                                            ? new Date(admin.createdAt).toLocaleDateString("en-GB", {
                                                  day: "numeric",
                                                  month: "long",
                                                  year: "numeric",
                                              })
                                            : "N/A"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Assigned Role Permissions Matrix */}
                        <div className="p-5 rounded-2xl bg-[#F7F5F0]/60 dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] space-y-3 pt-4">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-[#164E50] dark:text-teal-400" />
                                <h4 className="font-serif-title text-base font-bold text-[#1E293B] dark:text-white">
                                    Assigned Permissions ({roleName})
                                </h4>
                            </div>

                            {rolePermissions.length === 0 ? (
                                <p className="text-xs text-[#64748B] dark:text-slate-400">No specific permissions configured for this role.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {rolePermissions.map((perm: string) => (
                                        <span
                                            key={perm}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-[#162D32] border border-[#E5E0D8] dark:border-[#254C54] text-xs font-mono font-medium text-[#164E50] dark:text-teal-300 shadow-2xs"
                                        >
                                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                            <span>{perm}</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
