import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    title = "Confirm Deletion",
    description = "Are you sure you want to soft-delete this item? This action will archive the record.",
    confirmText = "Delete Record",
    isLoading = false,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border border-[#E5E0D8] shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div>
                    <h3 className="font-serif-title text-xl font-bold text-[#1E293B]">
                        {title}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2.5 rounded-full border border-[#E5E0D8] bg-white text-[#1E293B] hover:bg-slate-50 text-xs font-semibold transition"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <span>{confirmText}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
