import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight, Lock, Eye, EyeOff, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../api/client.js";
import { resetPasswordSchema } from "../../schemas/auth.schema.js";
import type { ResetPasswordFormData } from "../../schemas/auth.schema.js";
import type { ApiResponse } from "../../types/auth.js";

export const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tokenFromUrl = searchParams.get("token") || "";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(resetPasswordSchema),
        defaultValues: {
            token: tokenFromUrl,
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        const tokenToSubmit = data.token || tokenFromUrl;

        if (!tokenToSubmit) {
            toast.error("Missing reset password token. Please open the link sent to your email.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await apiClient.post<ApiResponse>(
                "/admin/auth/reset-password",
                {
                    token: tokenToSubmit,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                },
            );

            if (response.data.success) {
                setIsSuccess(true);
                toast.success("Password reset successfully! You can now log in.");
            }
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Invalid or expired password reset token";
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
                    to="/admin/login"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#164E50] transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to login</span>
                </Link>
            </div>

            {/* Title Section */}
            <div className="mb-8">
                <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1E293B] mb-2 tracking-tight">
                    Reset your password.
                </h2>
                <p className="text-[#64748B] text-sm leading-relaxed">
                    Create a new secure password for your administrator account.
                </p>
            </div>

            {/* Warning if opened without token query */}
            {!tokenFromUrl && !isSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                        No reset token detected in URL. Please make sure you clicked the link sent to your email.
                    </span>
                </div>
            )}

            {/* Success View */}
            {isSuccess ? (
                <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-[#E6F4EA] border border-[#1E7E34]/20 text-[#1E7E34] text-sm space-y-2">
                        <div className="flex items-center gap-2.5 font-bold">
                            <CheckCircle2 className="w-5 h-5 text-[#1E7E34]" />
                            <span>Password Reset Complete!</span>
                        </div>
                        <p className="text-xs opacity-90 leading-relaxed">
                            Your password has been reset successfully. Please proceed to log in with your new password.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/admin/login")}
                        className="w-full py-3.5 px-6 rounded-full bg-[#164E50] text-white hover:bg-[#113E40] font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>Go to Login</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                /* Reset Password Form (No manual token input field needed) */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Hidden token binding */}
                    <input type="hidden" {...register("token")} value={tokenFromUrl} />

                    {/* New Password */}
                    <div>
                        <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                            New Password
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

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                                className={`w-full pl-10 pr-11 py-3 bg-white border ${
                                    errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-[#E5E0D8] focus:border-[#164E50] focus:ring-[#164E50]"
                                } rounded-2xl text-sm text-[#1E293B] placeholder-[#64748B]/60 focus:outline-hidden focus:ring-1 transition shadow-2xs`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#1E293B] transition"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-6 rounded-full bg-[#164E50] text-white hover:bg-[#113E40] disabled:bg-slate-400 font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    <span>Resetting password...</span>
                                </>
                            ) : (
                                <>
                                    <span>Update Password</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
