import React from "react";

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-[#E5E0D8] dark:border-[#1F3E45] bg-[#F7F5F0] dark:bg-[#0E1D21] py-4 px-6 text-center text-xs text-[#64748B] dark:text-slate-400">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
                <p>© {new Date().getFullYear()} Handy Help GY. All rights reserved.</p>
                <div className="flex items-center gap-4 text-[#64748B] dark:text-slate-400">
                    <span className="hover:text-[#164E50] dark:hover:text-teal-300 cursor-pointer">Privacy Policy</span>
                    <span>•</span>
                    <span className="hover:text-[#164E50] dark:hover:text-teal-300 cursor-pointer">Terms of Service</span>
                    <span>•</span>
                    <span>System v1.0.0</span>
                </div>
            </div>
        </footer>
    );
};
