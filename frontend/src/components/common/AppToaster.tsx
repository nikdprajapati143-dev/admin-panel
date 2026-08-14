import React from "react";
import { Toaster } from "sonner";
import { useTheme } from "../../context/ThemeContext.js";

export const AppToaster: React.FC = () => {
    const { theme } = useTheme();

    return (
        <Toaster
            position="top-right"
            theme={theme}
            closeButton
            toastOptions={{
                style: {
                    borderRadius: "1rem",
                    fontFamily: "inherit",
                    padding: "0.875rem 1.25rem",
                    fontSize: "0.8125rem",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                },
                classNames: {
                    toast: "border border-[#E5E0D8] dark:border-[#254C54] bg-white dark:bg-[#162D32] text-[#1E293B] dark:text-white font-medium shadow-xl",
                    title: "font-semibold text-xs text-[#1E293B] dark:text-white",
                    description: "text-xs text-[#64748B] dark:text-slate-300",
                    success:
                        "!bg-[#EAF5F4] dark:!bg-[#12383A] !border-[#BBE3DF] dark:!border-[#1F585B] !text-[#164E50] dark:!text-teal-200",
                    error:
                        "!bg-red-50 dark:!bg-[#3B151A] !border-red-200 dark:!border-[#6B212B] !text-red-800 dark:!text-red-200",
                    info:
                        "!bg-slate-50 dark:!bg-[#122529] !border-slate-200 dark:!border-[#254C54] !text-[#164E50] dark:!text-teal-300",
                    warning:
                        "!bg-amber-50 dark:!bg-[#3D2612] !border-amber-200 dark:!border-[#633C17] !text-amber-800 dark:!text-amber-200",
                    closeButton:
                        "!bg-[#164E50]/10 dark:!bg-[#254C54] !text-[#164E50] dark:!text-teal-300 !border-transparent hover:!bg-[#164E50]/20",
                },
            }}
        />
    );
};
