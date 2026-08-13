import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Key, Lock } from "lucide-react";

export const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F5F0]">
            {/* Left Hero Panel (Matching Screenshot 1) */}
            <div className="lg:w-1/2 bg-[#164E50] text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[380px] lg:min-h-screen">
                {/* Brand Logo Header */}
                <div className="relative z-10">
                    <Link to="/admin/login" className="flex items-center gap-2.5 w-fit group">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 group-hover:bg-white/20 transition">
                            <Key className="w-4 h-4" />
                        </div>
                        <span className="font-serif-title text-xl font-bold tracking-tight text-white">
                            Handy Help <span className="text-amber-300 text-xs font-sans align-top">GY</span>
                        </span>
                    </Link>
                </div>

                {/* Hero Title & Subtext */}
                <div className="relative z-10 max-w-lg my-auto py-8">
                    <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-white tracking-tight">
                        Help that knows its way around home.
                    </h1>
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed font-normal">
                        A considered way to book local help, keep your day moving and feel looked after in the process.
                    </p>
                </div>

                {/* Bottom Footer Note */}
                <div className="relative z-10 flex items-center gap-2 text-white/60 text-xs pt-4 border-t border-white/10">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Your details are used only to keep your account safe.</span>
                </div>

                {/* Decorative Concentric Circular Graphic Accent (Bottom-Right) */}
                <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-72 h-72 rounded-full border border-white/10 pointer-events-none" />
            </div>

            {/* Right Form Panel (Matching Screenshot 1) */}
            <div className="lg:w-1/2 bg-[#F7F5F0] p-6 sm:p-12 lg:p-16 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};