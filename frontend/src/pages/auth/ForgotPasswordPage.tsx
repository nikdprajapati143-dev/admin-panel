import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../api/client.js";
import { forgotPasswordSchema } from "../../schemas/auth.schema.js";
import type { ForgotPasswordFormData } from "../../schemas/auth.schema.js";
import type { ApiResponse } from "../../types/auth.js";

export const ForgotPasswordPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: yupResolver(forgotPasswordSchema),
        defaultValues: {
            email: "superadmin@admin.com",
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);

        try {
            const response = await apiClient.post<ApiResponse<{ resetToken: string }>>(
                "/admin/auth/forgot-password",
                { email: data.email },
            );

            if (response.data.success) {
                // Show ONLY top-right toaster notification (no duplicate on-screen box or bypass button)
                toast.success("Password reset link has been sent to your email address!");
            }
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to send password reset email";
            // Show error in top-right toaster notification only
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
                    Forgot password?
                </h2>
                <p className="text-[#64748B] text-sm leading-relaxed">
                    Enter your registered email address to receive password reset instructions.
                </p>
            </div>

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                        Registered Email address
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

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-6 rounded-full bg-[#164E50] text-white hover:bg-[#113E40] disabled:bg-slate-400 font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                                <span>Sending link...</span>
                            </>
                        ) : (
                            <>
                                <span>Send Reset Link</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
