import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, UserCheck, Mail, Phone, Calendar, Loader2, AlertCircle, Edit2 } from "lucide-react";
import { apiClient } from "../../api/client.js";
import { getAvatarUrl } from "../../components/admins/AdminForm.js";
import type { ApiResponse } from "../../types/auth.js";

export const CustomerDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch Target Customer details
    const {
        data: customerResponse,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["customer-detail", id],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<any>>(`/admin/customers/${id}`);
            return res.data;
        },
        enabled: Boolean(id),
    });

    const customer = customerResponse?.data;
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <div className="w-full space-y-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-[#64748B] dark:text-slate-400">
                <Link to="/admin/customers" className="hover:text-[#164E50] dark:hover:text-teal-300 transition">
                    Customers
                </Link>
                <span>/</span>
                <span className="font-semibold text-[#1E293B] dark:text-white">Customer Details</span>
            </nav>

            {/* Page Header with Back & Edit Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8] dark:border-[#254C54]">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/admin/customers")}
                        className="p-2 rounded-xl border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-slate-600 dark:text-slate-300 hover:text-[#164E50] dark:hover:text-teal-300 transition shadow-2xs cursor-pointer"
                        title="Back to Customers"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#164E50]/10 dark:bg-[#164E50]/30 flex items-center justify-center text-[#164E50] dark:text-teal-300">
                                <UserCheck className="w-3.5 h-3.5" />
                            </div>
                            <h2 className="font-serif-title text-2xl font-bold text-[#1E293B] dark:text-white">
                                Customer Profile Details
                            </h2>
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                            View registered customer profile information, contact number, and metadata.
                        </p>
                    </div>
                </div>

                {customer && (
                    <button
                        onClick={() => navigate(`/admin/customers/${id}/edit`)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] text-white font-semibold text-xs transition shadow-md w-fit cursor-pointer"
                    >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit Customer Profile</span>
                    </button>
                )}
            </div>

            {/* Detail Card Container */}
            <div className="bg-white dark:bg-[#162D32] rounded-2xl p-6 sm:p-8 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs space-y-6">
                {isLoading ? (
                    <div className="py-12 text-center text-xs text-[#64748B] dark:text-slate-400 flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#164E50] dark:text-teal-400" />
                        <span>Loading customer profile...</span>
                    </div>
                ) : isError || !customer ? (
                    <div className="py-12 text-center text-xs text-red-500 flex flex-col items-center gap-2">
                        <AlertCircle className="w-6 h-6" />
                        <span>{(error as any)?.response?.data?.message || "Failed to load customer profile"}</span>
                        <button
                            onClick={() => navigate("/admin/customers")}
                            className="mt-2 px-4 py-2 rounded-full border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-[#1E293B] dark:text-white hover:bg-slate-50 text-xs font-semibold"
                        >
                            Return to Customer List
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Profile Overview Header Card */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-[#F7F5F0]/60 dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54]">
                            <img
                                src={getAvatarUrl(customer.avatar)}
                                alt={customer.firstName}
                                className="w-24 h-24 rounded-full object-cover border-2 border-[#E5E0D8] dark:border-[#254C54] shadow-sm shrink-0"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = defaultAvatar;
                                }}
                            />

                            <div className="space-y-2 text-center sm:text-left flex-1">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <h3 className="font-serif-title text-2xl font-bold text-[#1E293B] dark:text-white">
                                        {customer.firstName} {customer.lastName}
                                    </h3>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            customer.status === "ACTIVE"
                                                ? "bg-[#E6F4EA] dark:bg-emerald-950/80 text-[#1E7E34] dark:text-emerald-400 border dark:border-emerald-800/40"
                                                : "bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-400 border dark:border-red-800/40"
                                        }`}
                                    >
                                        {customer.status || "ACTIVE"}
                                    </span>
                                </div>

                                <p className="text-xs text-[#64748B] dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-[#164E50] dark:text-teal-400" />
                                    <span>{customer.email}</span>
                                </p>

                                <p className="text-xs text-[#64748B] dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 font-mono">
                                    <Phone className="w-3.5 h-3.5 text-[#164E50] dark:text-teal-400" />
                                    <span>{customer.countryCode || "+965"} {customer.phone}</span>
                                </p>
                            </div>
                        </div>

                        {/* Attribute Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                            <div className="p-4 rounded-xl border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529]">
                                <p className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                                    First Name
                                </p>
                                <p className="text-sm font-bold text-[#1E293B] dark:text-white">{customer.firstName}</p>
                            </div>

                            <div className="p-4 rounded-xl border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529]">
                                <p className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Last Name
                                </p>
                                <p className="text-sm font-bold text-[#1E293B] dark:text-white">{customer.lastName}</p>
                            </div>

                            <div className="p-4 rounded-xl border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529]">
                                <p className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Email Address
                                </p>
                                <p className="text-sm font-bold text-[#1E293B] dark:text-white">{customer.email}</p>
                            </div>

                            <div className="p-4 rounded-xl border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529]">
                                <p className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Phone Number
                                </p>
                                <p className="text-sm font-bold text-[#1E293B] dark:text-white font-mono">
                                    {customer.countryCode || "+965"} {customer.phone}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529]">
                                <p className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Account Status
                                </p>
                                <p className="text-sm font-bold text-[#1E293B] dark:text-white">{customer.status || "ACTIVE"}</p>
                            </div>

                            <div className="p-4 rounded-xl border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529]">
                                <p className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Created At
                                </p>
                                <p className="text-sm font-bold text-[#1E293B] dark:text-white flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#164E50] dark:text-teal-400" />
                                    <span>
                                        {customer.createdAt
                                            ? new Date(customer.createdAt).toLocaleDateString("en-GB", {
                                                  day: "numeric",
                                                  month: "long",
                                                  year: "numeric",
                                              })
                                            : "N/A"}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
