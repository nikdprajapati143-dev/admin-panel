import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Upload, Loader2 } from "lucide-react";
import { createCustomerSchema, updateCustomerSchema } from "../../schemas/customer.schema.js";
import { getAvatarUrl } from "../admins/AdminForm.js";

interface CustomerFormProps {
    initialData?: any | null;
    isLoading?: boolean;
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
    initialData,
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
        resolver: yupResolver(isEdit ? (updateCustomerSchema as any) : (createCustomerSchema as any)),
    });

    useEffect(() => {
        if (initialData) {
            reset({
                firstName: initialData.firstName || "",
                lastName: initialData.lastName || "",
                email: initialData.email || "",
                countryCode: initialData.countryCode || "+965",
                phone: initialData.phone || "",
            });
            setPreviewUrl(getAvatarUrl(initialData.avatar));
        } else {
            reset({
                firstName: "",
                lastName: "",
                email: "",
                countryCode: "+965",
                phone: "",
            });
            setPreviewUrl(null);
        }
        setAvatarFile(null);
    }, [initialData, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = (data: any) => {
        const formData = new FormData();
        if (data.firstName) formData.append("firstName", data.firstName);
        if (data.lastName) formData.append("lastName", data.lastName);
        if (data.email) formData.append("email", data.email);
        if (data.countryCode) formData.append("countryCode", data.countryCode);
        if (data.phone) formData.append("phone", data.phone);
        formData.append("status", initialData?.status || "ACTIVE");

        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        onSubmit(formData);
    };

    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
                        Customer Avatar
                    </label>
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#162D32] border border-[#E5E0D8] dark:border-[#254C54] text-xs font-semibold text-[#164E50] dark:text-teal-300 hover:bg-slate-50 dark:hover:bg-[#1D3B42] cursor-pointer shadow-2xs transition">
                        <Upload className="w-4 h-4" />
                        <span>Upload Photo</span>
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
                {/* Row 1: First Name */}
                <div>
                    <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="John"
                        {...register("firstName")}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition"
                    />
                    {errors.firstName && (
                        <p className="mt-1 text-[11px] text-red-500">{String(errors.firstName.message)}</p>
                    )}
                </div>

                {/* Row 1: Last Name */}
                <div>
                    <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Doe"
                        {...register("lastName")}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition"
                    />
                    {errors.lastName && (
                        <p className="mt-1 text-[11px] text-red-500">{String(errors.lastName.message)}</p>
                    )}
                </div>

                {/* Row 2: Email Address (Left Col) */}
                <div>
                    <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...register("email")}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition"
                    />
                    {errors.email && (
                        <p className="mt-1 text-[11px] text-red-500">{String(errors.email.message)}</p>
                    )}
                </div>

                {/* Row 2: Country Code & Phone Number (Right Col) */}
                <div>
                    <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                        <select
                            {...register("countryCode")}
                            className="w-2/5 px-2.5 py-2.5 bg-white dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition"
                        >
                            <option value="+965" className="bg-white dark:bg-[#122529] text-[#1E293B] dark:text-white">🇰🇼 +965</option>
                            <option value="+966" className="bg-white dark:bg-[#122529] text-[#1E293B] dark:text-white">🇸🇦 +966</option>
                            <option value="+971" className="bg-white dark:bg-[#122529] text-[#1E293B] dark:text-white">🇦🇪 +971</option>
                        </select>
                        <input
                            type="text"
                            placeholder="61234567"
                            {...register("phone")}
                            className="w-3/5 px-3.5 py-2.5 bg-white dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs font-mono text-[#1E293B] dark:text-white outline-hidden transition"
                        />
                    </div>
                    {errors.phone && (
                        <p className="mt-1 text-[11px] text-red-500">{String(errors.phone.message)}</p>
                    )}
                </div>
            </div>

            {/* Form Actions */}
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
                        <span>{isEdit ? "Update Customer" : "Save Customer"}</span>
                    )}
                </button>
            </div>
        </form>
    );
};
