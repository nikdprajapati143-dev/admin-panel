import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CheckSquare, Square } from "lucide-react";
import { apiClient } from "../../api/client.js";
import { roleSchema } from "../../schemas/role.schema.js";
import type { RoleFormData } from "../../schemas/role.schema.js";
import type { ApiResponse, RoleInfo } from "../../types/auth.js";

interface RoleFormProps {
    initialData?: RoleInfo | null;
    isLoading?: boolean;
    onSubmit: (data: RoleFormData) => void;
    onCancel: () => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({
    initialData,
    isLoading = false,
    onSubmit,
    onCancel,
}) => {
    const isEdit = Boolean(initialData);

    // Dynamically fetch system permissions list directly from backend MongoDB
    const { data: fetchedPermissionsData, isLoading: isPermissionsLoading } = useQuery({
        queryKey: ["permissions-list"],
        queryFn: async () => {
            const res = await apiClient.get<ApiResponse<{ permissions: any[]; grouped: Record<string, any[]> }>>("/admin/permissions");
            return res.data;
        },
    });

    // Dynamically construct permission groups for any existing or new modules
    const permissionGroups = useMemo(() => {
        const grouped = fetchedPermissionsData?.data?.grouped;
        if (!grouped || Object.keys(grouped).length === 0) {
            return [];
        }

        return Object.entries(grouped)
            .filter(([moduleName]) => moduleName.toUpperCase() !== "DASHBOARD")
            .map(([moduleName, items]) => ({
                group: `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1).toLowerCase()} Management`,
                items: items.map((i) => ({
                    key: i.code,
                    label: i.name || i.code,
                })),
            }));
    }, [fetchedPermissionsData]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<RoleFormData>({
        resolver: yupResolver(roleSchema),
        defaultValues: {
            name: "",
            description: "",
            permissions: [],
        },
    });

    useEffect(() => {
        if (initialData) {
            const initialPerms = initialData.permissions || [];
            reset({
                name: initialData.name,
                description: initialData.description || "",
                permissions: initialData.name === "SUPER_ADMIN" ? ["*"] : initialPerms,
            });
        } else {
            reset({
                name: "",
                description: "",
                permissions: [],
            });
        }
    }, [initialData, reset]);

    const isSystemRole = initialData && ["SUPER_ADMIN", "SUB_ADMIN"].includes(initialData.name);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Name */}
            <div>
                <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                    Role Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="e.g. STORE_MANAGER"
                    disabled={Boolean(isSystemRole)}
                    {...register("name")}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 disabled:bg-slate-100 dark:disabled:bg-[#1E293B] rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition"
                />
                {errors.name && (
                    <p className="mt-1 text-[11px] text-red-500">{errors.name.message}</p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-semibold text-[#1E293B] dark:text-slate-200 mb-1.5">
                    Description
                </label>
                <textarea
                    rows={3}
                    placeholder="Brief summary of responsibilities..."
                    {...register("description")}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] focus:border-[#164E50] dark:focus:border-teal-500 rounded-xl text-xs text-[#1E293B] dark:text-white outline-hidden transition resize-none"
                />
            </div>

            {/* Permissions Section */}
            <div>
                <label className="block text-xs font-bold text-[#1E293B] dark:text-white mb-2">
                    Assigned Permissions <span className="text-red-500">*</span>
                </label>
                {errors.permissions && (
                    <p className="mb-2 text-[11px] text-red-500">{errors.permissions.message}</p>
                )}

                {isPermissionsLoading ? (
                    <div className="p-8 text-center text-xs text-[#64748B] dark:text-slate-400 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#164E50]" />
                        <span>Loading permissions matrix...</span>
                    </div>
                ) : (
                    <Controller
                        name="permissions"
                        control={control}
                        render={({ field: { value = [], onChange } }) => {
                            const allKeys = permissionGroups.flatMap((g) => g.items.map((i) => i.key));
                            const hasWildcard = value.includes("*");

                            // If wildcard is present, all keys are considered selected
                            const effectiveSelectedKeys = hasWildcard ? allKeys : value;
                            const isAllGlobalSelected =
                                hasWildcard || (allKeys.length > 0 && allKeys.every((k) => value.includes(k)));

                            const handleToggleAllGlobal = () => {
                                if (isAllGlobalSelected) {
                                    onChange([]);
                                } else {
                                    onChange(hasWildcard ? ["*"] : allKeys);
                                }
                            };

                            return (
                                <div className="space-y-4">
                                    {/* Global Select All All Modules Header */}
                                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-[#162D32] border border-[#E5E0D8] dark:border-[#254C54] shadow-2xs">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-[#1E293B] dark:text-white">
                                                Select All Module Permissions
                                            </span>
                                            <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                                                ({effectiveSelectedKeys.length} of {allKeys.length} selected)
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleToggleAllGlobal}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F5F0] dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] text-xs font-bold text-[#164E50] dark:text-teal-300 hover:bg-slate-100 dark:hover:bg-[#1D3B42] transition cursor-pointer"
                                        >
                                            {isAllGlobalSelected ? (
                                                <CheckSquare className="w-4 h-4 text-[#164E50] dark:text-teal-300" />
                                            ) : (
                                                <Square className="w-4 h-4 text-slate-400" />
                                            )}
                                            <span>{isAllGlobalSelected ? "Deselect All" : "Select All"}</span>
                                        </button>
                                    </div>

                                    {/* Permission Groups List */}
                                    {permissionGroups.map((group) => {
                                        const groupKeys = group.items.map((i) => i.key);
                                        const isGroupAllSelected =
                                            hasWildcard ||
                                            (groupKeys.length > 0 && groupKeys.every((k) => value.includes(k)));

                                        const handleToggleGroup = () => {
                                            const baseList = hasWildcard ? allKeys : value;
                                            if (isGroupAllSelected) {
                                                onChange(baseList.filter((k: string) => !groupKeys.includes(k)));
                                            } else {
                                                const newValues = Array.from(new Set([...baseList, ...groupKeys]));
                                                onChange(newValues);
                                            }
                                        };

                                        return (
                                            <div
                                                key={group.group}
                                                className="p-4 rounded-2xl bg-[#F7F5F0]/60 dark:bg-[#122529] border border-[#E5E0D8] dark:border-[#254C54] space-y-3"
                                            >
                                                {/* Module Group Header with Group Select All Checkbox */}
                                                <div className="flex items-center justify-between pb-1 border-b border-[#E5E0D8]/60 dark:border-[#254C54]">
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#164E50] dark:text-teal-300">
                                                        {group.group}
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={handleToggleGroup}
                                                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-[#164E50] dark:hover:text-teal-300 transition cursor-pointer"
                                                    >
                                                        {isGroupAllSelected ? (
                                                            <CheckSquare className="w-3.5 h-3.5 text-[#164E50] dark:text-teal-300" />
                                                        ) : (
                                                            <Square className="w-3.5 h-3.5 text-slate-400" />
                                                        )}
                                                        <span>{isGroupAllSelected ? "Deselect Group" : "Select Group"}</span>
                                                    </button>
                                                </div>

                                                {/* Individual Permission Checkboxes */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                    {group.items.map((perm) => {
                                                        const isChecked = hasWildcard || value.includes(perm.key);
                                                        return (
                                                            <button
                                                                type="button"
                                                                key={perm.key}
                                                                onClick={() => {
                                                                    const currentList = hasWildcard ? allKeys : value;
                                                                    if (isChecked) {
                                                                        onChange(currentList.filter((p) => p !== perm.key));
                                                                    } else {
                                                                        onChange([...currentList, perm.key]);
                                                                    }
                                                                }}
                                                                className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium border transition text-left cursor-pointer ${isChecked
                                                                    ? "bg-white dark:bg-[#162D32] border-[#164E50] dark:border-teal-400 text-[#164E50] dark:text-teal-300 font-bold shadow-2xs"
                                                                    : "bg-white/50 dark:bg-[#0F1D21] border-[#E5E0D8] dark:border-[#254C54] text-slate-600 dark:text-slate-300 hover:border-slate-300"
                                                                    }`}
                                                            >
                                                                {isChecked ? (
                                                                    <CheckSquare className="w-4 h-4 text-[#164E50] dark:text-teal-300 shrink-0" />
                                                                ) : (
                                                                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                                                                )}
                                                                <span className="truncate">{perm.label}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        }}
                    />
                )}
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
                        <span>{isEdit ? "Update Role" : "Save Role"}</span>
                    )}
                </button>
            </div>
        </form>
    );
};
