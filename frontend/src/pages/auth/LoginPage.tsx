import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";
import { loginSchema } from "../../schemas/auth.schema.js";
import type { LoginFormData } from "../../schemas/auth.schema.js";
import type { ApiResponse, LoginResponse } from "../../types/auth.js";

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: "superadmin@admin.com",
            password: "SuperAdmin@123",
            rememberMe: true,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            const response = await apiClient.post<ApiResponse<LoginResponse>>(
                "/admin/auth/login",
                {
                    email: data.email,
                    password: data.password,
                },
            );

            if (response.data.success && response.data.data) {
                const { accessToken, admin } = response.data.data;
                useAuthStore.getState().setAuth(admin, accessToken);

                toast.success("Login successful! Welcome back.");
                navigate("/admin/dashboard", { replace: true });
            }
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Invalid credentials or server error";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* Top Navigation */}
            <div className="mb-8">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#164E50] transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to home</span>
                </Link>
            </div>

            {/* Title Section (Matching Screenshot 1) */}
            <div className="mb-8">
                <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1E293B] mb-2 tracking-tight">
                    Welcome back.
                </h2>
                <p className="text-[#64748B] text-sm leading-relaxed">
                    Enter your admin credentials to log in to your account.
                </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                        Email address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            {...register("email")}
                            className={`w-full pl-10 pr-4 py-3 bg-white border ${
                                errors.email ? "border-red-500 focus:ring-red-500" : "border-[#E5E0D8] focus:border-[#164E50] focus:ring-[#164E50]"
                            } rounded-2xl text-sm text-[#1E293B] placeholder-[#64748B]/60 focus:outline-hidden focus:ring-1 transition shadow-2xs`}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("password")}
                            className={`w-full pl-10 pr-11 py-3 bg-white border ${
                                errors.password ? "border-red-500 focus:ring-red-500" : "border-[#E5E0D8] focus:border-[#164E50] focus:ring-[#164E50]"
                            } rounded-2xl text-sm text-[#1E293B] placeholder-[#64748B]/60 focus:outline-hidden focus:ring-1 transition shadow-2xs`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#1E293B] transition"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                    )}
                </div>

                {/* Options Row */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            {...register("rememberMe")}
                            className="w-4 h-4 text-[#164E50] border-[#E5E0D8] rounded-md focus:ring-[#164E50]"
                        />
                        <span className="text-xs text-[#64748B] font-medium">Remember me</span>
                    </label>

                    <Link
                        to="/admin/forgot-password"
                        className="text-xs font-semibold text-[#164E50] hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Submit Pill Button (Matching Screenshot 1) */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-6 rounded-full bg-[#164E50] text-white hover:bg-[#113E40] disabled:bg-slate-400 font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                                <span>Logging in...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign in</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
