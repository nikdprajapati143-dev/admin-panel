import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Upload, Loader2, Mail } from "lucide-react";
import { createAdminSchema, updateAdminSchema } from "../../schemas/admin.schema.js";
import type { AdminUser, RoleInfo } from "../../types/auth.js";

interface AdminFormProps {
    initialData?: AdminUser | null;
    roles: RoleInfo[];
    isLoading?: boolean;
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
}

export const getAvatarUrl = (avatar?: string | null): string => {
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    if (!avatar) return defaultAvatar;
    if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
    const backendHost = "http://localhost:5000";
    return `${backendHost}${avatar.startsWith("/") ? "" : "/"}${avatar}`;
};

export const AdminForm: React.FC<AdminFormProps> = ({
    initialData,
    roles,
    isLoading = false,
    onSubmit,
    onCancel,
}) => {
    const isEdit = Boolean(initialData);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(isEdit ? (updateAdminSchema as any) : (createAdminSchema as any)),
    });

    useEffect(() => {
        if (initialData) {
            const roleId = typeof initialData.role === "object" ? initialData.role._id || initialData.role.id : initialData.role;
            reset({
                name: initialData.name || "",
                email: initialData.email || "",
                role: roleId || (roles.length > 0 ? roles[0].id || roles[0]._id : ""),
            });
            setPreviewUrl(getAvatarUrl(initialData.avatar));
        } else {
            reset({
                name: "",
                email: "",
                role: roles.length > 0 ? roles[0].id || roles[0]._id : "",
            });
            setPreviewUrl(null);
        }
        setAvatarFile(null);
    }, [initialData, reset, roles]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = (data: any) => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.role) formData.append("role", data.role);
        formData.append("status", initialData?.status || "ACTIVE");

        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        onSubmit(formData);
    };

    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Informational Notice Banner for Creation */}
            {!isEdit && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
                    <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">Automated Credentials Delivery</p>
                        <p className="opacity-90 mt-0.5">
                            A secure temporary password will be automatically generated and sent to the administrator's email address upon account creation.
                        </p>
                    </div>
                </div>
            )}

            {/* Avatar Upload Preview */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7F5F0] dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54]">
                <img
                    src={previewUrl || defaultAvatar}
                    alt="Avatar Preview"
                    className="w-16 h-16 rounded-full object-cover border border-[#E5E0D8] dark:border-[#254C54] shrink-0"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultAvatar;
                    }}
                />
                <div className="flex-1">
                    <label className="block text-xs font-bold text-[#1E293B] dark:text-white mb-1">
                        Profile Avatar
                    </label>
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#162D32] border border-[#E5E0D8] dark:border-[#254C54] text-xs font-semibold text-[#164E50] dark:text-teal-300 hover:bg-slate-50 dark:hover:bg-[#1D3B42] cursor-pointer shadow-2xs transition">
                        <Upload className="w-4 h-4" />
                        <span>Choose Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Grid layout for form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                    <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        {...register("name")}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition"
                    />
                    {errors.name && (
                        <p className="mt-1 text-[11px] text-red-500">{String(errors.name.message)}</p>
                    )}
                </div>

                {/* Email Address */}
                <div>
                    <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="admin@example.com"
                        {...register("email")}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition"
                    />
                    {errors.email && (
                        <p className="mt-1 text-[11px] text-red-500">{String(errors.email.message)}</p>
                    )}
                </div>

                {/* Assign Role */}
                <div className="">
                    <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                        Assign Role <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register("role")}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition"
                    >
                        {roles.map((role) => (
                            <option key={role.id || role._id} value={role.id || role._id} className="bg-white dark:bg-[#122529] text-[#1E293B] dark:text-white">
                                {role.name}
                            </option>
                        ))}
                    </select>
                    {errors.role && (
                        <p className="mt-1 text-[11px] text-red-500">{String(errors.role.message)}</p>
                    )}
                </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E5E0D8] dark:border-[#254C54]">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 rounded-full border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#122529] text-[#1E293B] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1D3B42] text-xs font-semibold transition cursor-pointer"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-full bg-[#164E50] hover:bg-[#113E40] disabled:bg-slate-400 text-white text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <span>{isEdit ? "Update Admin" : "Save Admin"}</span>
                    )}
                </button>
            </div>
        </form>
    );
};
