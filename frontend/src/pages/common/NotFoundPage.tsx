import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogIn } from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="min-h-screen bg-[#F8F6F0] dark:bg-[#0D1B1E] flex items-center justify-center p-4 selection:bg-[#164E50] selection:text-white transition-colors duration-200">
            {/* Background Decorative Gradient Blobs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#164E50]/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md bg-white dark:bg-[#162D32] rounded-3xl border border-[#E5E0D8] dark:border-[#254C54] shadow-2xl p-8 sm:p-10 text-center space-y-6">
                {/* 404 Badge Icon */}
                <div className="relative inline-flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-[#164E50]/10 dark:bg-teal-500/20 flex items-center justify-center text-[#164E50] dark:text-teal-300 transform -rotate-3">
                        <ShieldAlert className="w-10 h-10" />
                    </div>
                    <span className="absolute -top-2 -right-3 px-2.5 py-0.5 rounded-full bg-red-500 text-white font-mono font-bold text-xs shadow-md">
                        404
                    </span>
                </div>

                {/* Heading & Subtext */}
                <div className="space-y-2">
                    <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1E293B] dark:text-white">
                        Page Not Found
                    </h1>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-300 leading-relaxed">
                        Oops! The page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
                    </p>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-[#1E293B] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1D3B42] text-xs font-semibold transition cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Go Back</span>
                    </button>

                    {isAuthenticated ? (
                        <Link
                            to="/admin/dashboard"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] text-white text-xs font-semibold transition shadow-md cursor-pointer"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>
                    ) : (
                        <Link
                            to="/admin/login"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] text-white text-xs font-semibold transition shadow-md cursor-pointer"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Login</span>
                        </Link>
                    )}
                </div>

                {/* Footer Branding */}
                <p className="text-[11px] text-[#94A3B8] dark:text-slate-500 font-medium">
                    Admin Management System &bull; Secure Enterprise Portal
                </p>
            </div>
        </div>
    );
};
