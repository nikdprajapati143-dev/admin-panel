import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    User,
    Mail,
    Shield,
    Upload,
    Loader2,
    Save,
    KeyRound,
    Lock,
    Eye,
    EyeOff,
    ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../api/client.js";
import { profileSchema } from "../../schemas/profile.schema.js";
import type { ProfileFormData } from "../../schemas/profile.schema.js";
import { changePasswordSchema } from "../../schemas/changePassword.schema.js";
import type { ChangePasswordFormData } from "../../schemas/changePassword.schema.js";
import { useAuthStore } from "../../store/authStore.js";
import { getAvatarUrl } from "../../components/admins/AdminForm.js";
import type { AdminUser, ApiResponse } from "../../types/auth.js";

export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { admin, setAdmin, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState<"edit" | "password">("edit");

    // Profile Form State
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(getAvatarUrl(admin?.avatar));
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    // Password Form State
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    // Profile Form Hook
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormData>({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            name: admin?.name || "",
            email: admin?.email || "",
        },
    });

    // Password Form Hook
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        formState: { errors: passwordErrors },
    } = useForm<ChangePasswordFormData>({
        resolver: yupResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (admin) {
            resetProfile({
                name: admin.name,
                email: admin.email,
            });
            setPreviewUrl(getAvatarUrl(admin.avatar));
        }
    }, [admin, resetProfile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onProfileSubmit = async (data: ProfileFormData) => {
        setIsProfileLoading(true);
        try {
            const formData = new FormData();
            if (data.name) formData.append("name", data.name);
            if (data.email) formData.append("email", data.email);
            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            const response = await apiClient.put<ApiResponse<AdminUser>>(
                "/admin/profile",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );

            if (response.data.success && response.data.data) {
                const updatedAdmin = response.data.data;
                setAdmin(updatedAdmin);
                toast.success("Profile updated successfully!");
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to update profile";
            toast.error(msg);
        } finally {
            setIsProfileLoading(false);
        }
    };

    const onPasswordSubmit = async (data: ChangePasswordFormData) => {
        setIsPasswordLoading(true);
        try {
            const response = await apiClient.post<ApiResponse>(
                "/admin/auth/change-password",
                {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                    confirmPassword: data.confirmPassword,
                },
            );

            if (response.data.success) {
                toast.success(
                    "Password changed successfully! Active sessions invalidated. Please log in again.",
                );
                resetPassword();
                await logout();
                navigate("/admin/login", { replace: true });
            }
        } catch (error: any) {
            const msg =
                error.response?.data?.message || "Failed to change password. Please check your current password.";
            toast.error(msg);
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    const roleObj = typeof admin?.role === "object" ? admin.role : null;
    const roleName = roleObj ? roleObj.name : "Administrator";

    return (
        <div className="w-full space-y-6">
            {/* Header Title Section */}
            <div>
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#164E50]/10 dark:bg-[#164E50]/30 flex items-center justify-center text-[#164E50] dark:text-teal-300">
                        <User className="w-4 h-4" />
                    </div>
                    <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white">
                        Admin Profile Settings
                    </h2>
                </div>
                <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
                    Manage your administrator account details, avatar image, and password credentials.
                </p>
            </div>

            {/* Profile Header Summary Card */}
            <div className="bg-white dark:bg-[#162D32] rounded-2xl p-6 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group shrink-0">
                    <img
                        src={previewUrl || defaultAvatar}
                        alt={admin?.name || "Admin"}
                        className="w-24 h-24 rounded-full object-cover border-2 border-[#E5E0D8] dark:border-[#254C54] shadow-sm"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultAvatar;
                        }}
                    />
                    <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#164E50] text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-[#113E40] transition">
                        <Upload className="w-4 h-4" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h3 className="font-serif-title text-2xl font-bold text-[#1E293B] dark:text-white">
                            {admin?.name || "Administrator"}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4EA] dark:bg-emerald-950/80 text-[#1E7E34] dark:text-emerald-400 border dark:border-emerald-800/40">
                            {admin?.status || "ACTIVE"}
                        </span>
                    </div>

                    <p className="text-xs text-[#64748B] dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#164E50] dark:text-teal-400" />
                        <span>{admin?.email}</span>
                    </p>

                    <div className="pt-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F5F0] dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] text-slate-700 dark:text-slate-200">
                            <Shield className="w-3.5 h-3.5 text-[#164E50] dark:text-teal-400" />
                            <span>Role: {roleName}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Profile Tabs Navigation */}
            <div className="flex border-b border-[#E5E0D8] dark:border-[#254C54]">
                <button
                    onClick={() => setActiveTab("edit")}
                    className={`inline-flex items-center gap-2 px-6 py-3 border-b-2 text-xs font-bold transition cursor-pointer ${
                        activeTab === "edit"
                            ? "border-[#164E50] text-[#164E50] dark:border-teal-400 dark:text-teal-400"
                            : "border-transparent text-[#64748B] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-white"
                    }`}
                >
                    <User className="w-4 h-4" />
                    <span>Edit Profile</span>
                </button>

                <button
                    onClick={() => setActiveTab("password")}
                    className={`inline-flex items-center gap-2 px-6 py-3 border-b-2 text-xs font-bold transition cursor-pointer ${
                        activeTab === "password"
                            ? "border-[#164E50] text-[#164E50] dark:border-teal-400 dark:text-teal-400"
                            : "border-transparent text-[#64748B] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-white"
                    }`}
                >
                    <KeyRound className="w-4 h-4" />
                    <span>Change Password</span>
                </button>
            </div>

            {/* Tab 1: Edit Profile */}
            {activeTab === "edit" && (
                <div className="bg-white dark:bg-[#162D32] rounded-2xl p-6 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs space-y-5">
                    <h3 className="font-serif-title text-xl font-bold text-[#1E293B] dark:text-white mb-2">
                        Account Details
                    </h3>

                    <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] dark:text-slate-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    {...registerProfile("name")}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition"
                                />
                            </div>
                            {profileErrors.name && (
                                <p className="mt-1 text-xs text-red-500">{profileErrors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] dark:text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    {...registerProfile("email")}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition"
                                />
                            </div>
                            {profileErrors.email && (
                                <p className="mt-1 text-xs text-red-500">{profileErrors.email.message}</p>
                            )}
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={isProfileLoading}
                                className="px-6 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] disabled:bg-slate-400 text-white font-semibold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
                            >
                                {isProfileLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Saving changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save Profile</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tab 2: Change Password */}
            {activeTab === "password" && (
                <div className="space-y-5">
                    {/* Security Notice Box */}
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
                        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold">Security Notice</p>
                            <p className="opacity-90 mt-0.5">
                                Changing your password will invalidate all existing sessions. You will be prompted to log in again with your new password.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#162D32] rounded-2xl p-6 border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs">
                        <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-5">
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
                                        {...registerPassword("currentPassword")}
                                        className={`w-full pl-10 pr-11 py-2.5 bg-white dark:bg-[#122529] border ${
                                            passwordErrors.currentPassword
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
                                {passwordErrors.currentPassword && (
                                    <p className="mt-1 text-xs text-red-500">{passwordErrors.currentPassword.message}</p>
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
                                        {...registerPassword("newPassword")}
                                        className={`w-full pl-10 pr-11 py-2.5 bg-white dark:bg-[#122529] border ${
                                            passwordErrors.newPassword
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
                                {passwordErrors.newPassword && (
                                    <p className="mt-1 text-xs text-red-500">{passwordErrors.newPassword.message}</p>
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
                                        {...registerPassword("confirmPassword")}
                                        className={`w-full pl-10 pr-11 py-2.5 bg-white dark:bg-[#122529] border ${
                                            passwordErrors.confirmPassword
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
                                {passwordErrors.confirmPassword && (
                                    <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmPassword.message}</p>
                                )}
                            </div>

                            {/* Form Action */}
                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isPasswordLoading}
                                    className="px-6 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] disabled:bg-slate-400 text-white font-semibold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
                                >
                                    {isPasswordLoading ? (
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
            )}
        </div>
    );
};
