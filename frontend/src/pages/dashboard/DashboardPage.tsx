import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    Users,
    Shield,
    UserCheck,
    Plus,
    ArrowRight,
    HelpCircle,
    Activity,
} from "lucide-react";
import { apiClient } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";
import type { ApiResponse } from "../../types/auth.js";

export const DashboardPage: React.FC = () => {
    const { admin } = useAuthStore();

    // Today Date formatted matching Image 2 reference (e.g. THURSDAY, 13 AUGUST 2026)
    const todayFormatted = new Date()
        .toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        .toUpperCase();

    // Fetch stats using TanStack Query
    const { data: adminsData, isLoading: isLoadingAdmins } = useQuery({
        queryKey: ["admins-stats"],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<any>>("/admin/admins?limit=5");
            return res.data;
        },
    });

    const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
        queryKey: ["roles-stats"],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<any>>("/admin/roles?limit=5");
            return res.data;
        },
    });

    const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
        queryKey: ["customers-stats"],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<any>>("/admin/customers?limit=5");
            return res.data;
        },
    });

    const totalAdmins = adminsData?.meta?.totalDocs || 0;
    const totalRoles = rolesData?.meta?.totalDocs || 0;
    const totalCustomers = customersData?.meta?.totalDocs || 0;
    const recentCustomers = customersData?.data || [];

    return (
        <div className="space-y-8">
            {/* Header Title & Main Action Button (Matching Image 2 Reference) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    {/* Red Uppercase Date Tag matching Image 2 */}
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[#C53030] dark:text-[#F87171] mb-1">
                        {todayFormatted}
                    </p>
                    <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1E293B] dark:text-white tracking-tight">
                        Good morning, {admin?.name || "Super Admin"}.
                    </h2>
                    <p className="text-[#64748B] dark:text-slate-400 text-sm mt-1">
                        What would you like to manage in your system today?
                    </p>
                </div>

                {/* Primary Action Button */}
                {/* <Link
                    to="/admin/admins/create"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#164E50] hover:bg-[#113E40] text-white font-semibold text-xs tracking-wide transition-all shadow-md shrink-0 w-fit cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create new Admin</span>
                </Link> */}
            </div>

            {/* Top Metric Cards Grid (4 Cards matching Image 1 & Image 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Metric 1: Admins */}
                <div className="relative bg-white dark:bg-[#162D32] rounded-2xl p-5 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs overflow-hidden flex flex-col justify-between h-36">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#64748B] dark:text-slate-300">Total Administrators</span>
                        <div className="w-7 h-7 rounded-lg bg-[#FDF2E9] dark:bg-[#253D42] flex items-center justify-center text-amber-600 dark:text-amber-300">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-serif-title text-3xl font-bold text-[#1E293B] dark:text-white">
                            {isLoadingAdmins ? "..." : totalAdmins}
                        </h3>
                        <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1">Active platform managers</p>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-[#FDF2E9] dark:bg-[#253D42] opacity-70 pointer-events-none" />
                </div>

                {/* Metric 2: Roles */}
                <div className="relative bg-white dark:bg-[#162D32] rounded-2xl p-5 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs overflow-hidden flex flex-col justify-between h-36">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#64748B] dark:text-slate-300">Configured Roles</span>
                        <div className="w-7 h-7 rounded-lg bg-[#FDF2E9] dark:bg-[#253D42] flex items-center justify-center text-amber-600 dark:text-amber-300">
                            <Shield className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-serif-title text-3xl font-bold text-[#1E293B] dark:text-white">
                            {isLoadingRoles ? "..." : totalRoles}
                        </h3>
                        <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1">System & custom access roles</p>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-[#FDF2E9] dark:bg-[#253D42] opacity-70 pointer-events-none" />
                </div>

                {/* Metric 3: Customers */}
                <div className="relative bg-white dark:bg-[#162D32] rounded-2xl p-5 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs overflow-hidden flex flex-col justify-between h-36">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#64748B] dark:text-slate-300">Registered Customers</span>
                        <div className="w-7 h-7 rounded-lg bg-[#FDF2E9] dark:bg-[#253D42] flex items-center justify-center text-amber-600 dark:text-amber-300">
                            <UserCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-serif-title text-3xl font-bold text-[#1E293B] dark:text-white">
                            {isLoadingCustomers ? "..." : totalCustomers}
                        </h3>
                        <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1">Kuwait region users</p>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-[#FDF2E9] dark:bg-[#253D42] opacity-70 pointer-events-none" />
                </div>

                {/* Metric 4: System Status */}
                <div className="relative bg-white dark:bg-[#162D32] rounded-2xl p-5 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs overflow-hidden flex flex-col justify-between h-36">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#64748B] dark:text-slate-300">System Status</span>
                        <div className="w-7 h-7 rounded-lg bg-[#E6F4EA] dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-serif-title text-3xl font-bold text-[#1E293B] dark:text-white">99.9%</h3>
                        <p className="text-[11px] font-semibold text-[#1E7E34] dark:text-emerald-400 mt-1">Operational & Healthy</p>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-[#E6F4EA] dark:bg-emerald-950/40 opacity-70 pointer-events-none" />
                </div>
            </div>

            {/* Middle Section (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Recent Customers */}
                <div className="lg:col-span-2 bg-white dark:bg-[#162D32] rounded-2xl p-6 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-serif-title text-xl font-bold text-[#1E293B] dark:text-white">
                                Recent Customers
                            </h3>
                            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                                Keep an eye on new customer registrations.
                            </p>
                        </div>
                        <Link
                            to="/admin/customers"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#164E50] dark:text-teal-400 hover:underline"
                        >
                            <span>View all</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Customer Items List */}
                    <div className="space-y-3 pt-2">
                        {isLoadingCustomers ? (
                            <p className="text-xs text-[#64748B] dark:text-slate-400 py-4 text-center">Loading customer activity...</p>
                        ) : recentCustomers.length === 0 ? (
                            <p className="text-xs text-[#64748B] dark:text-slate-400 py-4 text-center">No recent customers found.</p>
                        ) : (
                            recentCustomers.map((cust: any) => (
                                <div
                                    key={cust.id || cust._id}
                                    className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E0D8]/60 dark:border-[#254C54] bg-[#F7F5F0]/30 dark:bg-[#0F1D21]/60 hover:bg-[#F7F5F0] dark:hover:bg-[#0F1D21] transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#FDF2E9] dark:bg-[#253D42] flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold text-xs shrink-0 overflow-hidden border border-[#E5E0D8] dark:border-[#254C54]">
                                            {cust.avatar ? (
                                                <img
                                                    src={cust.avatar}
                                                    alt={cust.firstName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                                    }}
                                                />
                                            ) : (
                                                `${cust.firstName[0]}${cust.lastName[0]}`
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-[#1E293B] dark:text-white">
                                                {cust.firstName} {cust.lastName}
                                            </h4>
                                            <p className="text-[11px] text-[#64748B] dark:text-slate-400">
                                                {cust.countryCode} {cust.phone} • {cust.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E6F4EA] dark:bg-emerald-950/80 text-[#1E7E34] dark:text-emerald-400 border dark:border-emerald-800/40">
                                        {cust.status || "ACTIVE"}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column - Good to know */}
                <div className="bg-white dark:bg-[#162D32] rounded-2xl p-6 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-serif-title text-xl font-bold text-[#1E293B] dark:text-white">
                                Good to know
                            </h3>
                            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                                A little context from your system.
                            </p>
                        </div>
                        <HelpCircle className="w-4 h-4 text-[#64748B] dark:text-slate-400" />
                    </div>

                    <div className="space-y-4 pt-2 text-xs">
                        <div className="flex items-start gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                            <div>
                                <p className="font-bold text-[#1E293B] dark:text-white">System roles protected</p>
                                <p className="text-[#64748B] dark:text-slate-400 mt-0.5">
                                    SUPER_ADMIN and SUB_ADMIN roles are safeguarded against soft deletion.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                            <div>
                                <p className="font-bold text-[#1E293B] dark:text-white">Kuwait phone (+965)</p>
                                <p className="text-[#64748B] dark:text-slate-400 mt-0.5">
                                    Customer phone numbers are enforced and separated by country code.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                            <div>
                                <p className="font-bold text-[#1E293B] dark:text-white">Super Admin Isolation</p>
                                <p className="text-[#64748B] dark:text-slate-400 mt-0.5">
                                    Sub-Admins cannot view or modify Super Admin accounts.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section (Quick Operations Row) */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-[#C53030] dark:text-red-400">
                            FOR YOUR SYSTEM
                        </p>
                        <h3 className="font-serif-title text-xl font-bold text-[#1E293B] dark:text-white">
                            Quick Operations
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Operation 1 */}
                    <Link
                        to="/admin/admins"
                        className="bg-[#FDF2E9] dark:bg-[#162D32] hover:bg-[#fae7d6] dark:hover:bg-[#1D3B42] p-5 rounded-2xl border border-amber-200/60 dark:border-[#254C54] transition group flex flex-col justify-between h-36"
                    >
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#253D42] flex items-center justify-center text-amber-700 dark:text-amber-300 shadow-2xs">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-serif-title text-lg font-bold text-[#1E293B] dark:text-white group-hover:text-[#164E50] dark:group-hover:text-teal-300 transition">
                                Manage Admins
                            </h4>
                            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                                Create, search, and update system administrators.
                            </p>
                        </div>
                    </Link>

                    {/* Operation 2 */}
                    <Link
                        to="/admin/roles"
                        className="bg-[#E6F4EA] dark:bg-[#162D32] hover:bg-[#d8eedd] dark:hover:bg-[#1D3B42] p-5 rounded-2xl border border-emerald-200/60 dark:border-[#254C54] transition group flex flex-col justify-between h-36"
                    >
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#253D42] flex items-center justify-center text-emerald-700 dark:text-emerald-300 shadow-2xs">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-serif-title text-lg font-bold text-[#1E293B] dark:text-white group-hover:text-[#164E50] dark:group-hover:text-teal-300 transition">
                                Manage Roles
                            </h4>
                            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                                Configure granular permissions and system roles.
                            </p>
                        </div>
                    </Link>

                    {/* Operation 3 */}
                    <Link
                        to="/admin/customers"
                        className="bg-[#FEF3C7] dark:bg-[#162D32] hover:bg-[#fde8a0] dark:hover:bg-[#1D3B42] p-5 rounded-2xl border border-yellow-200/60 dark:border-[#254C54] transition group flex flex-col justify-between h-36"
                    >
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#253D42] flex items-center justify-center text-yellow-800 dark:text-amber-300 shadow-2xs">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-serif-title text-lg font-bold text-[#1E293B] dark:text-white group-hover:text-[#164E50] dark:group-hover:text-teal-300 transition">
                                Manage Customers
                            </h4>
                            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                                Search, filter, and manage customer accounts.
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};
