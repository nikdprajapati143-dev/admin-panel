import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { KeyRound, Lock, Eye, EyeOff, Loader2, Save, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../api/client.js";
import { changePasswordSchema } from "../../schemas/changePassword.schema.js";
import type { ChangePasswordFormData } from "../../schemas/changePassword.schema.js";
import { useAuthStore } from "../../store/authStore.js";
import type { ApiResponse } from "../../types/auth.js";

export const ChangePasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormData>({
        resolver: yupResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        setIsLoading(true);

        try {
            const response = await apiClient.post<ApiResponse>(
                "/admin/auth/change-password",
                {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                },
            );

            if (response.data.success) {
                toast.success(
                    "Password changed successfully! Active sessions invalidated. Please log in again.",
                );
                reset();
                await logout();
                navigate("/admin/login", { replace: true });
            }
        } catch (error: any) {
            const msg =
                error.response?.data?.message || "Failed to change password. Please check your current password.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Header Title Section */}
            <div>
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#164E50]/10 dark:bg-[#164E50]/30 flex items-center justify-center text-[#164E50] dark:text-teal-300">
                        <KeyRound className="w-4 h-4" />
                    </div>
                    <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white">
                        Change Password
                    </h2>
                </div>
                <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
                    Update your account password to ensure your administrator session remains secure.
                </p>
            </div>

            {/* Security Notice Box */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold">Security Notice</p>
                    <p className="opacity-90 mt-0.5">
                        Changing your password will invalidate all existing refresh tokens and active sessions. You will be prompted to log in again with your new password.
                    </p>
                </div>
            </div>

            {/* Change Password Form Card */}
            <div className="bg-white dark:bg-[#162D32] rounded-2xl p-6 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Current Password */}
                    <div>
                        <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                            Current Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] dark:text-slate-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("currentPassword")}
                                className={`w-full pl-10 pr-11 py-2.5 bg-white dark:bg-[#122529] border ${
                                    errors.currentPassword
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500"
                                } rounded-xl text-xs text-[#1E293B] dark:text-white placeholder-[#64748B]/60 dark:placeholder-slate-500 outline-hidden transition`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-white transition"
                            >
                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                            New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] dark:text-slate-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("newPassword")}
                                className={`w-full pl-10 pr-11 py-2.5 bg-white dark:bg-[#122529] border ${
                                    errors.newPassword
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500"
                                } rounded-xl text-xs text-[#1E293B] dark:text-white placeholder-[#64748B]/60 dark:placeholder-slate-500 outline-hidden transition`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-white transition"
                            >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
                        )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] dark:text-slate-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                                className={`w-full pl-10 pr-11 py-2.5 bg-white dark:bg-[#122529] border ${
                                    errors.confirmPassword
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500"
                                } rounded-xl text-xs text-[#1E293B] dark:text-white placeholder-[#64748B]/60 dark:placeholder-slate-500 outline-hidden transition`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-white transition"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Form Action */}
                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] disabled:bg-slate-400 text-white font-semibold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Updating password...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Update Password</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
